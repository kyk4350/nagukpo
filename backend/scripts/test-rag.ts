/**
 * RAG 시스템 테스트 스크립트
 *
 * 실행 방법: npx tsx scripts/test-rag.ts
 */

import dotenv from 'dotenv'
import { searchRelevantProblems, generateAnswerWithRAG } from '../src/services/rag.service'

dotenv.config()

async function testRAG() {
  console.log('🧪 RAG 시스템 테스트 시작...\n')

  try {
    // 테스트 1: 유사 문제 검색
    console.log('📌 테스트 1: 유사 문제 검색')
    console.log('검색 쿼리: "표준어와 방언의 차이는 무엇인가요?"\n')

    const results = await searchRelevantProblems('표준어와 방언의 차이는 무엇인가요?', 3)

    console.log(`✅ ${results.length}개의 유사 문제를 찾았습니다:\n`)

    results.forEach((result, idx) => {
      console.log(`[${idx + 1}] 유사도: ${(result.similarity * 100).toFixed(1)}%`)
      console.log(`레벨: ${result.metadata.level} | 난이도: ${result.metadata.difficulty} | 유형: ${result.metadata.type}`)
      console.log(`질문: ${result.metadata.question}`)
      console.log(`정답: ${result.metadata.answer}`)
      console.log('---\n')
    })

    // 테스트 2: RAG 기반 답변 생성
    console.log('📌 테스트 2: RAG 기반 답변 생성')
    console.log('질문: "높임법을 언제 사용하나요?"\n')

    const answer = await generateAnswerWithRAG('높임법을 언제 사용하나요?')

    console.log('✅ 생성된 답변:\n')
    console.log(answer)
    console.log('\n')

    console.log('🎉 RAG 시스템 테스트 완료!')
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error)
    throw error
  }
}

// 실행
testRAG()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
