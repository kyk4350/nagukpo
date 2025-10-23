import prisma from '../src/utils/prisma'

async function main() {
  console.log('\n📊 DB에 있는 문제 유형 분포:\n')

  const problemsByType = await prisma.problem.groupBy({
    by: ['type'],
    _count: true,
  })

  problemsByType.forEach((item) => {
    console.log(`  ${item.type}: ${item._count}개`)
  })

  console.log('\n📈 사용자가 푼 문제 유형:\n')

  const userProgress = await prisma.userProgress.findMany({
    include: {
      problem: {
        select: {
          type: true,
        },
      },
    },
  })

  const userTypeCount: Record<string, number> = {}
  userProgress.forEach((progress) => {
    const type = progress.problem.type
    userTypeCount[type] = (userTypeCount[type] || 0) + 1
  })

  Object.entries(userTypeCount).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}개 풀이`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
