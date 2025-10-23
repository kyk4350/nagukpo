import OpenAI from 'openai'
import prisma from '../src/utils/prisma'
import { ProblemType, Difficulty } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface GeneratedProblem {
  question: string
  options: string[]
  answer: string
  explanation: string
}

// GPT-4로 문제 생성
async function generateProblemsWithGPT(
  type: 'grammar' | 'writing',
  level: number,
  difficulty: Difficulty,
  count: number
): Promise<GeneratedProblem[]> {
  const levelDescriptions = {
    1: {
      easy: '초등학교 6학년 ~ 중학교 1학년 초반 수준의 기초적인',
      medium: '중학교 1학년 수준의 표준적인',
      hard: '중학교 1학년 수준에서 심화된',
    },
    2: {
      easy: '중학교 2학년 수준의 기본적인',
      medium: '중학교 2학년 수준의 표준적이고 다소 복잡한',
      hard: '중학교 2학년 수준에서 심화되고 까다로운',
    },
    3: {
      easy: '중학교 3학년 수준의 기본적인',
      medium: '중학교 3학년 수준의 표준적이고 응용이 필요한',
      hard: '중학교 3학년 ~ 고등학교 1학년 수준의 어려운',
    },
    4: {
      easy: '고등학교 1학년 수준의 기본적인',
      medium: '고등학교 수준의 표준적이고 분석력이 필요한',
      hard: '고등학교 수준의 매우 어렵고 사고력이 필요한',
    },
  }

  const difficultyDesc = levelDescriptions[level as keyof typeof levelDescriptions][difficulty]

  const prompts = {
    grammar: `다음 조건에 맞는 국어 문법 문제를 ${count}개 생성해주세요:

**난이도**: ${difficultyDesc}
**대상 학년**: ${level === 1 ? '초등 6학년 ~ 중1' : level === 2 ? '중2' : level === 3 ? '중3' : '고1'}
**난이도 구분**: ${difficulty === 'easy' ? '쉬움 (기초)' : difficulty === 'medium' ? '보통 (표준)' : '어려움 (심화)'}

**출제 유형 (균형있게 섞어서)**:
- 맞춤법 (띄어쓰기, 어미 활용, 소리 나는 대로/어법에 맞게)
- 문장 성분 (주어, 서술어, 목적어, 보어)
- 품사 구분 및 활용
${level >= 2 ? '- 시제, 피동/사동 표현' : ''}
${level >= 2 ? '- 높임법 (주체 높임, 객체 높임, 상대 높임)' : ''}
${level >= 3 ? '- 문장의 짜임 (홑문장, 겹문장, 안은문장)' : ''}
${level >= 3 ? '- 관형사형/명사형 전성 어미' : ''}
${level >= 4 ? '- 복잡한 문장 구조 분석' : ''}
${level >= 4 ? '- 문법 요소의 미묘한 의미 차이' : ''}

**난이도 기준**:
- easy: ${level === 1 ? '기본 맞춤법과 간단한 문장 성분' : level === 2 ? '표준적인 맞춤법과 품사' : level === 3 ? '기본적인 문장 구조' : '복잡하지 않은 문법 규칙'}
- medium: ${level === 1 ? '헷갈리기 쉬운 맞춤법' : level === 2 ? '높임법, 시제 등 응용 문법' : level === 3 ? '문장의 짜임 분석' : '심화 문법 규칙 적용'}
- hard: ${level === 1 ? '복잡한 문장 성분 분석' : level === 2 ? '어려운 높임법이나 시제' : level === 3 ? '복잡한 문장 구조 변환' : '매우 어려운 문법 규칙과 예외'}

각 문제당 4개의 선택지를 제공하고, JSON 배열 형식으로 반환하세요.

예시 형식:
[
  {
    "question": "다음 문장에서 주어와 서술어가 호응하지 않는 것은?",
    "options": ["나는 학교에 간다.", "학생들이 운동장에서 뛰어논다.", "책을 읽고 있다.", "그는 친구를 만났다."],
    "answer": "책을 읽고 있다.",
    "explanation": "이 문장은 주어가 생략되어 있어 주어와 서술어의 호응을 확인할 수 없습니다."
  }
]`,
    writing: `다음 조건에 맞는 국어 작문/쓰기 문제를 ${count}개 생성해주세요:

**난이도**: ${difficultyDesc}
**대상 학년**: ${level === 1 ? '초등 6학년 ~ 중1' : level === 2 ? '중2' : level === 3 ? '중3' : '고1'}
**난이도 구분**: ${difficulty === 'easy' ? '쉬움 (기초)' : difficulty === 'medium' ? '보통 (표준)' : '어려움 (심화)'}

**출제 유형 (균형있게 섞어서)**:
- 문장 다듬기 (중복, 호응, 어색한 표현)
- 문장 연결 (접속어 사용)
- 문단 구성 (주제문, 뒷받침 문장, 문장 순서)
${level >= 2 ? '- 글의 구조와 전개 방식 (서론-본론-결론)' : ''}
${level >= 2 ? '- 논리적 오류 찾기' : ''}
${level >= 3 ? '- 설득 전략 및 논증 구조' : ''}
${level >= 3 ? '- 고쳐쓰기 (중의적 표현, 불필요한 표현 삭제)' : ''}
${level >= 4 ? '- 복잡한 글의 논리적 흐름 분석' : ''}
${level >= 4 ? '- 효과적인 표현 전략' : ''}

**난이도 기준**:
- easy: ${level === 1 ? '단순한 문장의 어색한 부분 찾기' : level === 2 ? '기본적인 문장 연결과 순서' : level === 3 ? '간단한 문단 구성' : '표준적인 글쓰기 원리'}
- medium: ${level === 1 ? '문장 연결이나 간단한 문단 구성' : level === 2 ? '논리적 흐름이나 주제문 파악' : level === 3 ? '설득 전략이나 고쳐쓰기' : '복잡한 글의 구조 분석'}
- hard: ${level === 1 ? '복잡한 문장 구조 개선' : level === 2 ? '어려운 논리적 오류 발견' : level === 3 ? '복잡한 논증 구조 분석' : '매우 정교한 표현 전략과 비판적 분석'}

각 문제당 4개의 선택지를 제공하고, JSON 배열 형식으로 반환하세요.

예시 형식:
[
  {
    "question": "다음 글의 흐름으로 보아 <보기>가 들어가기에 가장 적절한 곳은?\\n\\n(가) 독서는 지식을 쌓는 중요한 방법이다. (나) 특히 다양한 분야의 책을 읽으면 사고의 폭이 넓어진다. (다) 따라서 우리는 꾸준히 독서하는 습관을 길러야 한다.\\n\\n<보기> 그러나 무분별한 독서는 오히려 해가 될 수 있다.",
    "options": ["(가) 앞", "(가)와 (나) 사이", "(나)와 (다) 사이", "(다) 뒤"],
    "answer": "(나)와 (다) 사이",
    "explanation": "<보기>는 '그러나'로 시작하는 반전 내용이므로, 독서의 긍정적 측면을 언급한 (나) 뒤에 오는 것이 자연스럽습니다."
  }
]`,
  }

  console.log(`\n🤖 GPT-4로 ${type} (레벨 ${level}, ${difficulty}) 문제 ${count}개 생성 중...`)

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `당신은 중고등학생을 위한 국어 문제를 만드는 전문 교육자입니다.

**중요 원칙**:
1. 문제는 반드시 지정된 난이도와 학년 수준에 정확히 맞춰야 합니다
2. 너무 쉽거나 어려워서는 안 되며, 지정된 난이도에 적절해야 합니다
3. 해설은 학생들이 왜 그 답이 정답인지 명확히 이해할 수 있게 작성해야 합니다
4. 응답은 반드시 JSON 배열 형식으로만 작성하세요 (다른 텍스트 포함 금지)

**난이도 엄격 준수**:
- easy: 해당 학년 기초 수준 (정답률 70-80% 예상)
- medium: 해당 학년 표준 수준 (정답률 50-60% 예상)
- hard: 해당 학년 심화 수준 (정답률 30-40% 예상)`,
        },
        {
          role: 'user',
          content: prompts[type],
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('응답이 비어있습니다')

    const parsed = JSON.parse(content)
    const problems = parsed.problems || parsed

    console.log(`  ✅ ${problems.length}개 문제 생성 완료`)
    return problems
  } catch (error) {
    console.error(`  ❌ 생성 실패:`, error)
    return []
  }
}

async function main() {
  console.log('📚 부족한 문제 생성 시작...\n')

  const allProblems: any[] = []

  // 문법 레벨 4 medium, hard 생성
  console.log('\n=== GRAMMAR 레벨 4 (medium, hard) ===')

  const grammarMedium = await generateProblemsWithGPT('grammar', 4, Difficulty.medium, 3)
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const grammarHard = await generateProblemsWithGPT('grammar', 4, Difficulty.hard, 2)
  await new Promise((resolve) => setTimeout(resolve, 2000))

  grammarMedium.forEach((prob) => {
    allProblems.push({
      type: ProblemType.grammar,
      category: 'spelling',
      difficulty: Difficulty.medium,
      level: 4,
      question: prob.question,
      passage: null,
      options: prob.options,
      answer: prob.answer,
      explanation: prob.explanation,
      source: 'GPT-4 생성',
      tags: ['grammar', 'level4', 'medium'],
    })
  })

  grammarHard.forEach((prob) => {
    allProblems.push({
      type: ProblemType.grammar,
      category: 'spelling',
      difficulty: Difficulty.hard,
      level: 4,
      question: prob.question,
      passage: null,
      options: prob.options,
      answer: prob.answer,
      explanation: prob.explanation,
      source: 'GPT-4 생성',
      tags: ['grammar', 'level4', 'hard'],
    })
  })

  // 작문 레벨 1-4, 전체 난이도 생성
  console.log('\n=== WRITING 문제 (전체) ===')

  for (let level = 1; level <= 4; level++) {
    console.log(`\n📝 레벨 ${level}`)

    const difficultyConfig = [
      { difficulty: Difficulty.easy, count: 3 },
      { difficulty: Difficulty.medium, count: 3 },
      { difficulty: Difficulty.hard, count: 2 },
    ]

    for (const { difficulty, count } of difficultyConfig) {
      const generated = await generateProblemsWithGPT('writing', level, difficulty, count)

      generated.forEach((prob) => {
        allProblems.push({
          type: ProblemType.writing,
          category: 'sentence_correction',
          difficulty,
          level,
          question: prob.question,
          passage: null,
          options: prob.options,
          answer: prob.answer,
          explanation: prob.explanation,
          source: 'GPT-4 생성',
          tags: ['writing', `level${level}`, difficulty],
        })
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    console.log(`  ✅ 레벨 ${level} 완료: 8개 생성`)
  }

  console.log(`\n\n총 ${allProblems.length}개의 문제 생성 완료!`)
  console.log('\nDB에 저장 중...')

  // DB에 저장
  let savedCount = 0
  for (const problem of allProblems) {
    try {
      await prisma.problem.create({ data: problem })
      savedCount++
    } catch (error) {
      console.error(`  ⚠️  저장 실패:`, error)
    }
  }

  console.log(`\n✅ ${savedCount}개 문제 저장 완료!`)
  console.log(`\n📊 최종 통계:`)
  console.log(`  - 문법 레벨 4: ${grammarMedium.length + grammarHard.length}개`)
  console.log(`  - 작문 전체: ${savedCount - grammarMedium.length - grammarHard.length}개`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
