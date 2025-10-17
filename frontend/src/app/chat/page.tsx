'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { useSendMessage } from '@/hooks/queries/useChat'
import { getProblem } from '@/lib/api/problem'
import type { ChatMessage } from '@/lib/api/chat'

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const problemId = searchParams.get('problemId')

  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoadingProblem, setIsLoadingProblem] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasAutoSent = useRef(false)

  const sendMessageMutation = useSendMessage()

  useEffect(() => {
    if (!_hasHydrated) return

    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [_hasHydrated, isAuthenticated, router])

  // problemId가 있으면 자동으로 문제 설명 요청
  useEffect(() => {
    if (!problemId || !isAuthenticated || hasAutoSent.current) return

    const loadProblemAndAsk = async () => {
      setIsLoadingProblem(true)
      hasAutoSent.current = true

      try {
        const problem = await getProblem(problemId)

        // 문제 정보를 포함한 질문 생성
        const questionText = `다음 문제를 틀렸는데, 왜 틀렸는지 설명해주세요:

[문제]
${problem.question}

${problem.passage ? `[지문]\n${problem.passage}\n\n` : ''}${problem.options ? `[선택지]\n${problem.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}\n\n` : ''}[정답]
${problem.answer}

${problem.explanation ? `[해설]\n${problem.explanation}` : ''}`

        const userMessage: ChatMessage = {
          role: 'user',
          content: questionText,
        }

        setMessages([userMessage])

        // 자동으로 메시지 전송
        const response = await sendMessageMutation.mutateAsync({
          message: questionText,
          conversationHistory: [],
        })

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.message,
        }
        setMessages([userMessage, assistantMessage])
      } catch (error) {
        console.error('문제 정보 불러오기 실패:', error)
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: '문제 정보를 불러오는데 실패했어요. 다시 시도해주세요.',
        }
        setMessages([errorMessage])
      } finally {
        setIsLoadingProblem(false)
      }
    }

    loadProblemAndAsk()
  }, [problemId, isAuthenticated, sendMessageMutation])

  // 메시지가 추가되면 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || sendMessageMutation.isPending) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
    }

    // 사용자 메시지 즉시 표시
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      const response = await sendMessageMutation.mutateAsync({
        message: input.trim(),
        conversationHistory: messages,
      })

      // AI 응답 추가
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('메시지 전송 실패:', error)
      // 에러 메시지 표시
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '죄송해요, 응답을 생성하지 못했어요. 다시 시도해주세요.',
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!_hasHydrated || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            대시보드로
          </Link>
          <h1 className="text-xl font-bold text-gray-900">AI 선생님과 대화</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {isLoadingProblem ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                문제 정보를 불러오는 중...
              </h2>
              <div className="flex justify-center space-x-2 mt-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                안녕하세요! 무엇이든 물어보세요
              </h2>
              <p className="text-gray-600 mb-6">
                국어 문법, 어휘, 독해 등 궁금한 것을 질문해주세요
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <button
                  onClick={() => setInput("'은/는'과 '이/가'의 차이가 뭔가요?")}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-semibold text-gray-900 mb-1">조사 설명</div>
                  <div className="text-sm text-gray-600">'은/는'과 '이/가'의 차이가 뭔가요?</div>
                </button>
                <button
                  onClick={() => setInput('피동 표현과 사동 표현을 쉽게 설명해주세요')}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-semibold text-gray-900 mb-1">문법 개념</div>
                  <div className="text-sm text-gray-600">피동/사동 표현 설명해주세요</div>
                </button>
                <button
                  onClick={() => setInput('이력서 쓸 때 자주 틀리는 표현 알려주세요')}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-semibold text-gray-900 mb-1">실생활 국어</div>
                  <div className="text-sm text-gray-600">이력서 작성 팁 알려주세요</div>
                </button>
                <button
                  onClick={() => setInput('헷갈리는 맞춤법 알려주세요')}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-semibold text-gray-900 mb-1">맞춤법</div>
                  <div className="text-sm text-gray-600">자주 틀리는 맞춤법 알려주세요</div>
                </button>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                </div>
              </div>
            ))
          )}
          {sendMessageMutation.isPending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex space-x-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            rows={1}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={sendMessageMutation.isPending}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sendMessageMutation.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  )
}
