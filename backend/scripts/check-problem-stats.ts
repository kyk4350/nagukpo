import prisma from '../src/utils/prisma'

async function checkProblems() {
  console.log('=== 레벨/유형/난이도별 문제 분포 ===\n')

  const detailedStats = await prisma.$queryRaw<Array<{
    type: string
    difficulty: string
    level: number
    count: bigint
  }>>`
    SELECT type, difficulty, level, COUNT(*) as count
    FROM problems
    GROUP BY type, difficulty, level
    ORDER BY level, type, difficulty
  `

  console.table(detailedStats.map(s => ({
    ...s,
    count: Number(s.count)
  })))

  console.log('\n=== 유형별 전체 통계 ===\n')
  const typeStats = await prisma.$queryRaw<Array<{
    type: string
    count: bigint
  }>>`
    SELECT type, COUNT(*) as count
    FROM problems
    GROUP BY type
    ORDER BY type
  `

  console.table(typeStats.map(s => ({
    ...s,
    count: Number(s.count)
  })))

  console.log('\n=== 난이도별 전체 통계 ===\n')
  const difficultyStats = await prisma.$queryRaw<Array<{
    difficulty: string
    count: bigint
  }>>`
    SELECT difficulty, COUNT(*) as count
    FROM problems
    GROUP BY difficulty
    ORDER BY difficulty
  `

  console.table(difficultyStats.map(s => ({
    ...s,
    count: Number(s.count)
  })))

  console.log('\n=== 레벨별 전체 통계 ===\n')
  const levelStats = await prisma.$queryRaw<Array<{
    level: number
    count: bigint
  }>>`
    SELECT level, COUNT(*) as count
    FROM problems
    GROUP BY level
    ORDER BY level
  `

  console.table(levelStats.map(s => ({
    ...s,
    count: Number(s.count)
  })))

  await prisma.$disconnect()
}

checkProblems()
