import prisma from '../src/utils/prisma'

async function resetUserStats() {
  // 모든 사용자의 포인트와 경험치 초기화
  const result = await prisma.user.updateMany({
    data: {
      points: 0,
      experiencePoints: 0,
      level: 1,
    }
  })

  console.log(`${result.count}명의 사용자 통계가 초기화되었습니다.`)

  await prisma.$disconnect()
}

resetUserStats()
