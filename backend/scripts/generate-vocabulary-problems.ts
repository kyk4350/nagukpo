import axios from 'axios'
import prisma from '../src/utils/prisma'
import { ProblemType, Difficulty } from '@prisma/client'

/**
 * 표준국어대사전 API를 사용한 어휘 문제 생성
 * API 문서: https://stdict.korean.go.kr/openapi/openApiInfo.do
 */

// 레벨별 어휘 목록 (학년별로 적절한 단어)
const VOCABULARY_BY_LEVEL = {
  1: ['사랑', '평화', '행복', '친구', '가족', '희망', '용기', '정직', '배려', '존중'],
  2: ['성실', '책임', '협력', '공감', '겸손', '인내', '노력', '신뢰', '관용', '배려'],
  3: ['창의', '열정', '도전', '성취', '발전', '혁신', '통찰', '균형', '조화', '절제'],
  4: ['통섭', '융합', '성찰', '탐구', '비판', '객관', '주관', '논리', '합리', '윤리'],
}

interface DictionaryWord {
  word: string
  definition: string
  pos: string // 품사
  examples?: string[]
}

// 표준국어대사전 API 호출
async function searchWord(word: string): Promise<DictionaryWord | null> {
  try {
    const url = `https://stdict.korean.go.kr/api/search.do`
    const params = {
      key: '82C0CF829C23B40D73F6DEA91D85A679', // 공개 API 키 (무료)
      type_search: 'search',
      q: word,
      req_type: 'json',
      advanced: 'y',
      method: 'exact',
      num: 1,
    }

    const response = await axios.get(url, { params })

    if (response.data?.channel?.item?.[0]) {
      const item = response.data.channel.item[0]
      const sense = item.sense?.[0]

      return {
        word: item.word,
        definition: sense?.definition?.replace(/<[^>]*>/g, '') || '',
        pos: sense?.pos || '',
        examples: sense?.example ? [sense.example.replace(/<[^>]*>/g, '')] : [],
      }
    }

    return null
  } catch (error) {
    console.error(`단어 검색 실패 (${word}):`, error)
    return null
  }
}

// 오답 선택지 생성 (유사한 뜻의 단어들)
const SIMILAR_WORDS: { [key: string]: string[] } = {
  '사랑': ['애정', '호감', '정', '흠모'],
  '평화': ['안정', '고요', '평온', '평안'],
  '행복': ['기쁨', '만족', '즐거움', '쾌락'],
  '친구': ['동료', '벗', '지인', '친지'],
  '가족': ['가정', '일가', '친척', '혈육'],
  '희망': ['기대', '소망', '바람', '염원'],
  '용기': ['배짱', '담력', '패기', '의지'],
  '정직': ['성실', '솔직', '진실', '공정'],
  '배려': ['존중', '이해', '관심', '친절'],
  '성실': ['근면', '충실', '진지', '열심'],
  '책임': ['의무', '임무', '역할', '직분'],
  '협력': ['협조', '단합', '연대', '제휴'],
  '공감': ['이해', '동조', '동감', '공명'],
  '겸손': ['겸양', '검소', '수수', '소박'],
  '인내': ['참을성', '끈기', '인고', '극기'],
  '노력': ['수고', '애쓰기', '분투', '정진'],
  '신뢰': ['믿음', '신용', '신임', '확신'],
  '관용': ['너그러움', '포용', '아량', '용서'],
  '창의': ['독창', '발상', '창조', '혁신'],
  '열정': ['정열', '의욕', '열의', '열심'],
  '도전': ['시도', '모험', '도전', '도모'],
  '성취': ['달성', '완수', '이룩', '완성'],
  '발전': ['진보', '성장', '향상', '개선'],
  '혁신': ['변혁', '쇄신', '개혁', '갱신'],
  '통찰': ['간파', '꿰뚫음', '이해', '파악'],
  '균형': ['조화', '평형', '안정', '중용'],
  '조화': ['화합', '어울림', '조화', '융화'],
  '절제': ['자제', '억제', '검소', '단속'],
  '통섭': ['종합', '융합', '통합', '아우름'],
  '융합': ['결합', '합침', '통합', '혼합'],
  '성찰': ['반성', '숙고', '되돌아봄', '회고'],
  '탐구': ['연구', '탐색', '조사', '규명'],
  '비판': ['평가', '논평', '비평', '검토'],
  '객관': ['중립', '공정', '불편부당', '공평'],
  '주관': ['관점', '견해', '입장', '시각'],
  '논리': ['이치', '조리', '합리', '체계'],
  '합리': ['이성', '논리', '타당', '온당'],
  '윤리': ['도덕', '도의', '양심', '염치'],
}

// 문제 생성
async function generateVocabularyProblem(
  word: string,
  level: number,
  difficulty: Difficulty
): Promise<any> {
  console.log(`\n[레벨 ${level}] "${word}" 검색 중...`)

  const dictWord = await searchWord(word)

  if (!dictWord || !dictWord.definition) {
    console.log(`  ⚠️  사전에서 찾을 수 없음, 기본 정의 사용`)
    // 사전에 없으면 간단한 정의 사용
    return null
  }

  console.log(`  ✓ 정의: ${dictWord.definition.substring(0, 50)}...`)

  // 오답 선택지
  const wrongChoices = SIMILAR_WORDS[word] || ['기타1', '기타2', '기타3']
  const allChoices = [dictWord.definition, ...wrongChoices.slice(0, 3)]

  // 선택지 섞기
  const shuffled = allChoices.sort(() => Math.random() - 0.5)

  return {
    type: ProblemType.vocabulary,
    category: 'word_meaning',
    difficulty,
    level,
    question: `다음 단어의 뜻으로 알맞은 것은?\n\n**${word}**`,
    passage: null,
    options: shuffled,
    answer: dictWord.definition,
    explanation: `"${word}"는 "${dictWord.definition}"를 의미합니다.${
      dictWord.examples?.[0] ? `\n\n예문: ${dictWord.examples[0]}` : ''
    }`,
    source: '표준국어대사전',
    tags: ['어휘', '단어의미', dictWord.pos],
  }
}

async function main() {
  console.log('🔤 어휘 문제 생성 시작...\n')

  const problems: any[] = []

  // 레벨별로 문제 생성
  for (const [level, words] of Object.entries(VOCABULARY_BY_LEVEL)) {
    const levelNum = parseInt(level)
    console.log(`\n=== 레벨 ${levelNum} ===`)

    for (let i = 0; i < words.length; i++) {
      const word = words[i]

      // 난이도 결정 (앞쪽은 쉬움, 뒤쪽은 어려움)
      let difficulty: Difficulty
      if (i < 3) difficulty = Difficulty.easy
      else if (i < 7) difficulty = Difficulty.medium
      else difficulty = Difficulty.hard

      const problem = await generateVocabularyProblem(word, levelNum, difficulty)

      if (problem) {
        problems.push(problem)
        console.log(`  ✅ 문제 생성 완료 (난이도: ${difficulty})`)
      }

      // API 호출 제한 방지 (1초 대기)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  console.log(`\n\n총 ${problems.length}개의 어휘 문제 생성 완료!`)
  console.log('\nDB에 저장 중...')

  // DB에 저장
  for (const problem of problems) {
    await prisma.problem.create({ data: problem })
  }

  console.log('✅ 모든 문제 저장 완료!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
