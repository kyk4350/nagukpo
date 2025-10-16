import prisma from '../src/utils/prisma'

async function checkData() {
  try {
    // 문제 총 개수
    const totalProblems = await prisma.problem.count()
    console.log(`\n📊 총 문제 개수: ${totalProblems}개`)

    // 레벨별 문제 개수
    const byLevel = await prisma.problem.groupBy({
      by: ['level'],
      _count: true,
    })
    console.log('\n📚 레벨별 분포:')
    byLevel.forEach(item => {
      console.log(`  Level ${item.level}: ${item._count}개`)
    })

    // 난이도별 문제 개수
    const byDifficulty = await prisma.problem.groupBy({
      by: ['difficulty'],
      _count: true,
    })
    console.log('\n⭐ 난이도별 분포:')
    byDifficulty.forEach(item => {
      console.log(`  ${item.difficulty}: ${item._count}개`)
    })

    // 타입별 문제 개수
    const byType = await prisma.problem.groupBy({
      by: ['type'],
      _count: true,
    })
    console.log('\n📖 타입별 분포:')
    byType.forEach(item => {
      console.log(`  ${item.type}: ${item._count}개`)
    })

    // 샘플 문제 1개 출력
    const sample = await prisma.problem.findFirst({
      take: 1,
    })
    console.log('\n📝 샘플 문제:')
    console.log(`  질문: ${sample?.question.substring(0, 100)}...`)
    console.log(`  정답: ${sample?.answer}`)
    console.log(`  레벨: ${sample?.level}, 난이도: ${sample?.difficulty}`)

  } catch (error) {
    console.error('❌ 데이터 확인 실패:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()
