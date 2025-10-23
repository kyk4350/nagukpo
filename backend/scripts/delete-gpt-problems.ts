import prisma from '../src/utils/prisma'

async function deleteGPTProblems() {
  console.log('🗑️  GPT로 생성된 문제 삭제 중...\n')

  try {
    // GPT로 생성된 문제 개수 확인
    const gptProblems = await prisma.problem.count({
      where: {
        source: 'GPT-4 생성',
      },
    })

    console.log(`총 ${gptProblems}개의 GPT 생성 문제를 찾았습니다.`)

    // 유형별 개수 확인
    const vocabCount = await prisma.problem.count({
      where: { source: 'GPT-4 생성', type: 'vocabulary' },
    })
    const grammarCount = await prisma.problem.count({
      where: { source: 'GPT-4 생성', type: 'grammar' },
    })
    const writingCount = await prisma.problem.count({
      where: { source: 'GPT-4 생성', type: 'writing' },
    })

    console.log(`  - 어휘: ${vocabCount}개`)
    console.log(`  - 문법: ${grammarCount}개`)
    console.log(`  - 작문: ${writingCount}개`)

    console.log('\n삭제를 시작합니다...')

    // 삭제 실행
    const result = await prisma.problem.deleteMany({
      where: {
        source: 'GPT-4 생성',
      },
    })

    console.log(`\n✅ ${result.count}개의 문제가 삭제되었습니다!`)

    // 남은 문제 확인
    const remaining = await prisma.problem.count()
    console.log(`\n📊 현재 남은 문제: ${remaining}개`)

    const readingCount = await prisma.problem.count({
      where: { type: 'reading' },
    })
    console.log(`  - 독해: ${readingCount}개`)

  } catch (error) {
    console.error('❌ 삭제 중 오류 발생:', error)
  } finally {
    await prisma.$disconnect()
  }
}

deleteGPTProblems()
