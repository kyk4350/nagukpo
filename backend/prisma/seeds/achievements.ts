import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const achievements = [
  // 첫 걸음
  {
    code: 'first_problem',
    name: '첫 걸음',
    description: '첫 문제를 해결했습니다!',
    icon: '🎯',
    condition: {
      type: 'problem_count',
      count: 1,
    },
    points: 10,
  },

  // 연속 학습
  {
    code: 'streak_3',
    name: '꾸준함',
    description: '3일 연속으로 학습했습니다',
    icon: '🔥',
    condition: {
      type: 'streak_days',
      days: 3,
    },
    points: 50,
  },
  {
    code: 'streak_7',
    name: '일주일 챌린지',
    description: '7일 연속으로 학습했습니다',
    icon: '⭐',
    condition: {
      type: 'streak_days',
      days: 7,
    },
    points: 100,
  },
  {
    code: 'streak_30',
    name: '한 달의 기적',
    description: '30일 연속으로 학습했습니다',
    icon: '👑',
    condition: {
      type: 'streak_days',
      days: 30,
    },
    points: 500,
  },

  // 레벨 완료
  {
    code: 'level_1_complete',
    name: '레벨 1 정복',
    description: '레벨 1의 모든 문제를 풀었습니다',
    icon: '🥉',
    condition: {
      type: 'level_complete',
      level: 1,
    },
    points: 100,
  },
  {
    code: 'level_2_complete',
    name: '레벨 2 정복',
    description: '레벨 2의 모든 문제를 풀었습니다',
    icon: '🥈',
    condition: {
      type: 'level_complete',
      level: 2,
    },
    points: 150,
  },
  {
    code: 'level_3_complete',
    name: '레벨 3 정복',
    description: '레벨 3의 모든 문제를 풀었습니다',
    icon: '🥇',
    condition: {
      type: 'level_complete',
      level: 3,
    },
    points: 200,
  },
  {
    code: 'level_4_complete',
    name: '레벨 4 정복',
    description: '레벨 4의 모든 문제를 풀었습니다',
    icon: '💎',
    condition: {
      type: 'level_complete',
      level: 4,
    },
    points: 300,
  },

  // 정답률
  {
    code: 'accuracy_80',
    name: '명중률 80%',
    description: '전체 정답률이 80% 이상입니다',
    icon: '🎪',
    condition: {
      type: 'accuracy',
      rate: 80,
      minProblems: 20,
    },
    points: 150,
  },
  {
    code: 'accuracy_90',
    name: '명중률 90%',
    description: '전체 정답률이 90% 이상입니다',
    icon: '🎖️',
    condition: {
      type: 'accuracy',
      rate: 90,
      minProblems: 20,
    },
    points: 250,
  },
  {
    code: 'accuracy_95',
    name: '완벽주의자',
    description: '전체 정답률이 95% 이상입니다',
    icon: '💯',
    condition: {
      type: 'accuracy',
      rate: 95,
      minProblems: 50,
    },
    points: 500,
  },

  // 유형별 마스터
  {
    code: 'reading_master',
    name: '독해 마스터',
    description: '독해 문제 50개를 풀었습니다',
    icon: '📖',
    condition: {
      type: 'type_count',
      problemType: 'reading',
      count: 50,
    },
    points: 100,
  },
  {
    code: 'vocabulary_master',
    name: '어휘 마스터',
    description: '어휘 문제 30개를 풀었습니다',
    icon: '📚',
    condition: {
      type: 'type_count',
      problemType: 'vocabulary',
      count: 30,
    },
    points: 100,
  },
  {
    code: 'grammar_master',
    name: '문법 마스터',
    description: '문법 문제 30개를 풀었습니다',
    icon: '✏️',
    condition: {
      type: 'type_count',
      problemType: 'grammar',
      count: 30,
    },
    points: 100,
  },
  {
    code: 'writing_master',
    name: '작문 마스터',
    description: '작문 문제 30개를 풀었습니다',
    icon: '✍️',
    condition: {
      type: 'type_count',
      problemType: 'writing',
      count: 30,
    },
    points: 100,
  },

  // 스피드
  {
    code: 'speed_10',
    name: '빠른 손',
    description: '하루에 10문제를 풀었습니다',
    icon: '⚡',
    condition: {
      type: 'daily_count',
      count: 10,
    },
    points: 50,
  },
  {
    code: 'speed_20',
    name: '번개',
    description: '하루에 20문제를 풀었습니다',
    icon: '⚡⚡',
    condition: {
      type: 'daily_count',
      count: 20,
    },
    points: 100,
  },

  // 전체 완료
  {
    code: 'all_complete',
    name: '국어 정복자',
    description: '모든 문제를 풀었습니다!',
    icon: '🏆',
    condition: {
      type: 'all_complete',
    },
    points: 1000,
  },
]

async function seedAchievements() {
  console.log('🏅 Achievement 시드 데이터 생성 시작...\n')

  for (const achievement of achievements) {
    const existing = await prisma.achievement.findUnique({
      where: { code: achievement.code },
    })

    if (existing) {
      console.log(`  ⏭️  이미 존재: ${achievement.name}`)
    } else {
      await prisma.achievement.create({
        data: achievement,
      })
      console.log(`  ✅ 생성: ${achievement.icon} ${achievement.name}`)
    }
  }

  console.log('\n✨ Achievement 시드 데이터 생성 완료!')
  console.log(`총 ${achievements.length}개의 배지가 준비되었습니다.\n`)
}

seedAchievements()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
