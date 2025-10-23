/**
 * RAG (Retrieval-Augmented Generation) 서비스
 * Pinecone 벡터 DB에서 관련 문제를 검색하여 GPT-4에게 컨텍스트 제공
 */

import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { RetrievalQAChain } from 'langchain/chains'
import { PromptTemplate } from '@langchain/core/prompts'
import logger from '../utils/logger'

/**
 * Pinecone 클라이언트 초기화 (싱글톤)
 */
let pineconeClient: Pinecone | null = null
let vectorStore: PineconeStore | null = null

async function getPineconeClient(): Promise<Pinecone> {
  if (pineconeClient) {
    return pineconeClient
  }

  const apiKey = process.env.PINECONE_API_KEY

  if (!apiKey) {
    throw new Error('PINECONE_API_KEY가 설정되지 않았습니다.')
  }

  pineconeClient = new Pinecone({
    apiKey,
  })

  return pineconeClient
}

/**
 * Pinecone Vector Store 초기화
 */
async function getVectorStore(): Promise<PineconeStore> {
  if (vectorStore) {
    return vectorStore
  }

  const pinecone = await getPineconeClient()
  const indexName = process.env.PINECONE_INDEX_NAME || 'nagukpo-embeddings'
  const index = pinecone.Index(indexName)

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'text-embedding-3-small',
  })

  vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace: 'problems',
  })

  return vectorStore
}

/**
 * 사용자 질문과 관련된 문제 검색
 */
export async function searchRelevantProblems(query: string, topK: number = 3) {
  try {
    const store = await getVectorStore()

    // 유사도 검색
    const results = await store.similaritySearchWithScore(query, topK)

    logger.debug(`RAG 검색 결과: ${results.length}개 문서 발견`)

    return results.map(([doc, score]) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
      similarity: score,
    }))
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : ''
    logger.error(`RAG 검색 실패: ${errorMessage}`, errorStack)
    throw error
  }
}

/**
 * RAG 기반 답변 생성
 */
export async function generateAnswerWithRAG(
  question: string,
  conversationHistory?: { role: string; content: string }[]
): Promise<string> {
  try {
    // 1. 관련 문제 검색
    const relevantDocs = await searchRelevantProblems(question, 3)

    logger.info(`RAG: ${relevantDocs.length}개의 관련 문제 검색됨`)

    // 2. 컨텍스트 구성
    const context = relevantDocs
      .map((doc, idx) => {
        const meta = doc.metadata as any
        return `
[참고 문제 ${idx + 1}] (유사도: ${(doc.similarity * 100).toFixed(1)}%)
- 레벨: ${meta.level}
- 유형: ${meta.type}
- 질문: ${meta.question}
- 정답: ${meta.answer}

${doc.content}
        `.trim()
      })
      .join('\n\n---\n\n')

    // 3. 프롬프트 구성
    const systemPrompt = `당신은 한국어 국어 학습을 돕는 친절한 선생님입니다.

**역할:**
- 학생이 국어 문제를 이해하고 풀 수 있도록 도와주세요
- 틀린 문제에 대해서는 왜 틀렸는지 쉽게 설명해주세요
- 관련 개념을 쉬운 예시와 함께 설명해주세요
- 격려와 칭찬을 아끼지 마세요

**말투:**
- 존댓말을 사용하되, 친근하게 말해주세요
- 이모지를 적절히 사용해서 재미있게 해주세요
- 짧고 명확하게 설명해주세요

**제약사항:**
- 국어 학습과 관련 없는 질문에는 "국어 공부에 관해 물어봐주세요 😊"라고 답하세요
- 답변은 최대 500자로 제한해주세요

**참고 문제 데이터:**
다음은 학생의 질문과 관련이 있을 수 있는 문제들입니다. 필요한 경우 참고하세요.

${context}

위 참고 문제들을 바탕으로 학생의 질문에 답변해주세요. 하지만 참고 문제를 그대로 복사하지 말고, 학생의 질문에 맞게 설명해주세요.`

    // 4. GPT-4로 답변 생성
    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1500,
    })

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []).slice(-6), // 최근 3턴만 포함
      { role: 'user', content: question },
    ]

    const response = await model.invoke(
      messages.map((msg) => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
      }))
    )

    const answer = response.content.toString()

    logger.info('RAG 답변 생성 완료')

    return answer
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : ''
    logger.error(`RAG 답변 생성 실패: ${errorMessage}`, errorStack)
    throw error
  }
}

/**
 * 특정 문제에 대한 상세 설명 생성
 */
export async function explainProblem(problemId: string, userAnswer?: string): Promise<string> {
  try {
    // 1. 해당 문제와 유사한 문제들 검색
    const searchQuery = `문제 ID: ${problemId}`
    const relevantDocs = await searchRelevantProblems(searchQuery, 5)

    // 2. 해당 문제 찾기
    const targetProblem = relevantDocs.find(
      (doc) => (doc.metadata as any).problemId === problemId
    )

    if (!targetProblem) {
      throw new Error('문제를 찾을 수 없습니다.')
    }

    const meta = targetProblem.metadata as any

    // 3. 설명 프롬프트 구성
    const prompt = `다음 문제에 대해 상세하게 설명해주세요:

**문제 정보:**
- 레벨: ${meta.level}
- 유형: ${meta.type}
- 질문: ${meta.question}
- 정답: ${meta.answer}
${userAnswer ? `- 학생 답변: ${userAnswer}` : ''}

${targetProblem.content}

**설명 요청:**
${
  userAnswer && userAnswer !== meta.answer
    ? `학생이 "${userAnswer}"을(를) 선택했는데 틀렸습니다. 왜 틀렸는지, 그리고 왜 "${meta.answer}"이(가) 정답인지 쉽게 설명해주세요.`
    : `이 문제의 정답인 "${meta.answer}"에 대해 왜 그것이 정답인지 쉽게 설명해주세요.`
}

다른 선택지들은 왜 오답인지도 간단히 설명해주세요.
관련된 국어 개념이나 팁이 있다면 함께 알려주세요.`

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
    })

    const response = await model.invoke([
      {
        role: 'system',
        content: '당신은 친절한 국어 선생님입니다. 학생이 이해하기 쉽게 설명해주세요.',
      },
      { role: 'user', content: prompt },
    ])

    return response.content.toString()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : ''
    logger.error(`문제 설명 생성 실패: ${errorMessage}`, errorStack)
    throw error
  }
}
