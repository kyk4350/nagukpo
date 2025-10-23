import OpenAI from 'openai'
import prisma from '../utils/prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * 문제에 대한 힌트 생성 (3단계)
 */
export async function generateHint(problemId: string, hintLevel: 1 | 2 | 3) {
  // 문제 조회
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
  })

  if (!problem) {
    throw new Error('문제를 찾을 수 없습니다')
  }

  // 힌트 레벨에 따른 프롬프트 설정
  const hintPrompts = {
    1: '이 문제를 푸는 데 도움이 되는 간단한 힌트를 1-2문장으로 제공해주세요. 답을 직접 알려주지 말고, 어떤 방향으로 생각해야 하는지만 알려주세요.',
    2: '이 문제를 푸는 데 도움이 되는 좀 더 구체적인 힌트를 2-3문장으로 제공해주세요. 핵심 개념이나 주의해야 할 부분을 알려주되, 여전히 답은 직접 알려주지 마세요.',
    3: '이 문제를 푸는 데 도움이 되는 매우 자세한 힌트를 3-4문장으로 제공해주세요. 거의 답에 가까운 수준으로 자세히 설명하되, 최종 답은 학생이 스스로 찾을 수 있도록 해주세요.',
  }

  // OpenAI API 호출
  const systemPrompt = `당신은 중학생을 위한 국어 학습 도우미입니다. 학생이 문제를 스스로 풀 수 있도록 단계별 힌트를 제공하는 것이 목표입니다.`

  const userPrompt = `
다음 국어 문제에 대한 힌트를 제공해주세요.

${problem.passage ? `지문:\n${problem.passage}\n\n` : ''}문제: ${problem.question}

선택지:
${problem.options ? (problem.options as string[]).map((opt, i) => `${i + 1}. ${opt}`).join('\n') : ''}

정답: ${problem.answer}

${hintPrompts[hintLevel]}
`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const hint = completion.choices[0]?.message?.content || '힌트를 생성할 수 없습니다.'

    return {
      hint,
      level: hintLevel,
    }
  } catch (error) {
    console.error('힌트 생성 중 오류:', error)
    throw new Error('힌트 생성에 실패했습니다')
  }
}

export default {
  generateHint,
}
