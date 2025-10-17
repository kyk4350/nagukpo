import OpenAI from 'openai'
import prisma from '../utils/prisma'
import logger from '../utils/logger'

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 시스템 프롬프트: 국어 학습 AI 선생님 페르소나 정의
const SYSTEM_PROMPT = `당신은 **오직 국어 학습만** 돕는 전문 AI 선생님입니다.
절대로 국어와 무관한 주제에 답변하지 마세요.

대화 범위 (반드시 준수):
- 오직 국어 학습 관련 질문만 답변합니다
- 허용 주제: 국어 문법, 어휘, 맞춤법, 문학, 독해, 작문, 언어 예절
- 금지 주제: 수학, 과학, 역사, 영어, 일상 대화, 물건 만들기 등 국어 외 모든 주제

국어 외 질문을 받으면 반드시 이렇게 답변하세요:
"죄송하지만, 저는 국어 학습을 돕는 AI 선생님이에요. 국어와 관련된 질문을 해주시면 기쁘게 답변해드릴게요! 📚"

역할:
- 국어를 어려워하는 학생들을 돕는 멘토
- 친근하고 격려하는 톤으로 대화
- 복잡한 개념을 쉽게 설명
- 학생의 이해도에 맞춰 설명 수준 조절

말투:
- 존댓말 사용 (예: "~이에요", "~해요")
- 이모지 적절히 사용 (과하지 않게)
- 격려와 칭찬 자주 하기
- 어려운 용어는 쉬운 말로 풀어서 설명

대화 원칙:
1. 학생의 질문에 명확하고 간결하게 답변
2. 예시를 들어 설명
3. 이해했는지 확인
4. 추가 학습 자료나 문제 풀이 제안
5. 틀린 답변에도 격려하며 올바른 방향 제시`

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatRequest {
  userId: string
  message: string
  conversationHistory?: ChatMessage[]
}

export interface ChatResponse {
  message: string
  conversationHistory: ChatMessage[]
}

/**
 * AI 챗봇과 대화 처리
 */
export async function chat(request: ChatRequest): Promise<ChatResponse> {
  const { userId, message, conversationHistory = [] } = request

  try {
    // 대화 히스토리 구성
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ]

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    })

    let assistantMessage = completion.choices[0]?.message?.content || '죄송해요, 응답을 생성하지 못했어요.'
    const finishReason = completion.choices[0]?.finish_reason

    // 토큰 제한으로 응답이 잘린 경우 안내 메시지 추가
    if (finishReason === 'length') {
      assistantMessage += '\n\n💬 답변이 길어서 여기서 끝났어요. "계속 설명해줘"라고 말씀하시면 이어서 설명해드릴게요!'
      logger.warn(`Chat response truncated due to token limit for user: ${userId}`)
    }

    // 대화 히스토리에 추가
    const updatedHistory: ChatMessage[] = [
      ...conversationHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: assistantMessage },
    ]

    // 대화 히스토리 DB 저장
    await saveChatHistory(userId, message, assistantMessage)

    return {
      message: assistantMessage,
      conversationHistory: updatedHistory,
    }
  } catch (error) {
    logger.error('Chat service error:', error)
    throw new Error('챗봇 응답 생성에 실패했습니다.')
  }
}

/**
 * 대화 히스토리 저장
 */
async function saveChatHistory(userId: string, userMessage: string, assistantMessage: string) {
  try {
    await prisma.$transaction([
      prisma.chatMessage.create({
        data: {
          userId,
          content: userMessage,
          role: 'user',
        },
      }),
      prisma.chatMessage.create({
        data: {
          userId,
          content: assistantMessage,
          role: 'assistant',
        },
      }),
    ])
  } catch (error) {
    logger.error('Failed to save chat history:', error)
    // 저장 실패해도 챗봇 응답은 계속 진행
  }
}

/**
 * 사용자의 대화 히스토리 조회
 */
export async function getChatHistory(userId: string, limit: number = 50) {
  try {
    const history = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    // 최신 순으로 정렬 (오래된 것부터)
    return history.reverse().map((h) => ({
      role: h.role,
      content: h.content,
      createdAt: h.createdAt,
    }))
  } catch (error) {
    logger.error('Failed to get chat history:', error)
    return []
  }
}

/**
 * 대화 히스토리 삭제
 */
export async function clearChatHistory(userId: string) {
  try {
    await prisma.chatMessage.deleteMany({
      where: { userId },
    })
  } catch (error) {
    logger.error('Failed to clear chat history:', error)
    throw new Error('대화 히스토리 삭제에 실패했습니다.')
  }
}
