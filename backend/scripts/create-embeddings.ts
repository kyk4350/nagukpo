/**
 * 문제 데이터를 벡터 임베딩으로 변환하여 Pinecone에 저장하는 스크립트
 *
 * 실행 방법: npx tsx scripts/create-embeddings.ts
 */

import { PrismaClient } from '@prisma/client'
import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { Document } from 'langchain/document'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

/**
 * Pinecone 클라이언트 초기화
 */
async function initPinecone() {
  const apiKey = process.env.PINECONE_API_KEY

  if (!apiKey) {
    throw new Error('PINECONE_API_KEY가 설정되지 않았습니다.')
  }

  const pinecone = new Pinecone({
    apiKey,
  })

  return pinecone
}

/**
 * 문제를 Document 형식으로 변환
 */
function problemToDocument(problem: any): Document {
  // 문제 내용을 하나의 텍스트로 결합
  const content = [
    `문제 ID: ${problem.id}`,
    `레벨: ${problem.level}`,
    `난이도: ${problem.difficulty}`,
    `유형: ${problem.type}`,
    problem.passage ? `지문: ${problem.passage}` : '',
    `질문: ${problem.question}`,
    `선택지: ${problem.options.join(', ')}`,
    `정답: ${problem.answer}`,
    `해설: ${problem.explanation}`,
  ].filter(Boolean).join('\n')

  return new Document({
    pageContent: content,
    metadata: {
      problemId: problem.id,
      level: problem.level,
      difficulty: problem.difficulty,
      type: problem.type,
      question: problem.question,
      answer: problem.answer,
      source: problem.source || 'unknown',
    },
  })
}

/**
 * 메인 임베딩 생성 함수
 */
async function createEmbeddings() {
  console.log('🚀 임베딩 생성 시작...\n')

  try {
    // 1. Pinecone 초기화
    console.log('📌 Pinecone 초기화 중...')
    const pinecone = await initPinecone()
    const indexName = process.env.PINECONE_INDEX_NAME || 'nagukpo-embeddings'

    // 인덱스 존재 확인
    const indexes = await pinecone.listIndexes()
    const indexExists = indexes.indexes?.some(idx => idx.name === indexName)

    if (!indexExists) {
      console.log(`📝 인덱스 "${indexName}" 생성 중... (약 1분 소요)`)
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536, // OpenAI text-embedding-3-small의 차원
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      })

      // 인덱스 준비 대기
      console.log('⏳ 인덱스 준비 대기 중...')
      await new Promise(resolve => setTimeout(resolve, 60000))
    }

    const index = pinecone.Index(indexName)
    console.log('✅ Pinecone 인덱스 준비 완료\n')

    // 2. 모든 문제 가져오기
    console.log('📚 데이터베이스에서 문제 불러오는 중...')
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        level: true,
        difficulty: true,
        type: true,
        passage: true,
        question: true,
        options: true,
        answer: true,
        explanation: true,
        source: true,
      },
    })

    console.log(`✅ 총 ${problems.length}개의 문제를 불러왔습니다.\n`)

    if (problems.length === 0) {
      console.log('⚠️  데이터베이스에 문제가 없습니다. 먼저 데이터를 import하세요.')
      return
    }

    // 3. Document로 변환
    console.log('📄 문제를 Document 형식으로 변환 중...')
    const documents = problems.map(problemToDocument)
    console.log(`✅ ${documents.length}개의 Document 생성 완료\n`)

    // 4. OpenAI Embeddings 초기화
    console.log('🤖 OpenAI Embeddings 초기화 중...')
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small', // 저렴하고 빠른 모델
    })
    console.log('✅ OpenAI Embeddings 준비 완료\n')

    // 5. Pinecone에 임베딩 저장 (배치 처리)
    console.log('💾 Pinecone에 임베딩 저장 중...')
    console.log('⚠️  대량 데이터는 시간이 오래 걸릴 수 있습니다.\n')

    const batchSize = 100
    let processedCount = 0

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)

      await PineconeStore.fromDocuments(batch, embeddings, {
        pineconeIndex: index,
        namespace: 'problems', // 문제 데이터 네임스페이스
      })

      processedCount += batch.length
      console.log(`   처리 완료: ${processedCount}/${documents.length} (${Math.round((processedCount / documents.length) * 100)}%)`)
    }

    console.log('\n✅ 모든 임베딩이 Pinecone에 저장되었습니다!')

    // 6. 통계 출력
    console.log('\n📊 임베딩 생성 완료 통계:')
    console.log(`   - 총 문제 수: ${problems.length}개`)
    console.log(`   - 인덱스명: ${indexName}`)
    console.log(`   - 네임스페이스: problems`)
    console.log(`   - 차원: 1536`)

  } catch (error) {
    console.error('❌ 임베딩 생성 실패:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// 스크립트 실행
createEmbeddings()
  .then(() => {
    console.log('\n🎉 임베딩 생성 프로세스 완료!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 오류 발생:', error)
    process.exit(1)
  })
