import prisma from '../src/utils/prisma'

async function checkProgress() {
  const progressCount = await prisma.userProgress.count()
  console.log('UserProgress 레코드 개수:', progressCount)

  const progress = await prisma.userProgress.findMany({
    include: { problem: true }
  })

  console.log('\n각 진도 레코드:')
  progress.forEach((p, i) => {
    console.log(`${i+1}. problemId: ${p.problemId}, 문제 존재: ${p.problem ? 'O' : 'X'}`)
  })

  await prisma.$disconnect()
}

checkProgress()
