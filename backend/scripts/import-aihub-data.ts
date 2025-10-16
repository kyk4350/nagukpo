import fs from 'fs/promises'
import path from 'path'
import prisma from '../src/utils/prisma'

interface AIHubData {
  raw_data_info: {
    school: string
    grade: string
    semester: string
    subject: string
  }
  source_data_info: {
    source_data_name: string
    '2015_achievement_standard'?: string[]
    '2022_achievement_standard'?: string[]
    level_of_difficulty: string
  }
  learning_data_info: Array<{
    class_num: number
    class_name: string
    class_info_list: Array<{
      text_description: string
    }>
  }>
}

// 난이도 매핑
const difficultyMap: Record<string, string> = {
  '상': 'hard',
  '중': 'medium',
  '하': 'easy',
}

// 학년 → 레벨 매핑
const gradeLevelMap: Record<string, number> = {
  '초등학교 5학년': 1,
  '초등학교 6학년': 1,
  '중학교 1학년': 2,
  '중학교 2학년': 2,
  '중학교 3학년': 2,
  '고등학교 1학년': 3,
  '고등학교 2학년': 3,
  '고등학교 3학년': 4,
}

async function parseAIHubFile(filePath: string): Promise<any> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const data: AIHubData = JSON.parse(content)

    // 지문, 문항, 정답, 오답 추출
    let passage = ''
    let question = ''
    let answer = ''
    let wrongAnswers: string[] = []

    for (const item of data.learning_data_info) {
      const text = item.class_info_list[0]?.text_description || ''

      switch (item.class_name) {
        case '지문':
          passage = text
          break
        case '문항':
          question = text
          break
        case '정답':
          answer = text.replace(/^[①②③④⑤]\s*/, '') // 번호 제거
          break
        case '오답':
          // 오답 선지를 분리
          const wrongOpts = text
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^[①②③④⑤]\s*/, ''))
          wrongAnswers = wrongOpts
          break
      }
    }

    // options 생성 (정답 + 오답 섞기)
    const allOptions = [...wrongAnswers, answer]
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5)

    // 학년 정보로 레벨 결정
    const gradeKey = `${data.raw_data_info.school} ${data.raw_data_info.grade}`
    const level = gradeLevelMap[gradeKey] || 2

    // 난이도 변환
    const difficulty =
      difficultyMap[data.source_data_info.level_of_difficulty] || 'medium'

    return {
      type: 'reading', // AI Hub 데이터는 주로 독해 문제
      category: 'comprehension',
      difficulty,
      level,
      question,
      passage: passage || null,
      options: shuffledOptions,
      answer,
      explanation: `정답: ${answer}`,
      source: 'AI Hub - 국어 교과 지문형 문제',
      curriculumMapping: data.source_data_info['2022_achievement_standard']?.[0] || null,
      tags: [data.raw_data_info.school, data.raw_data_info.grade],
    }
  } catch (error) {
    console.error(`파일 파싱 실패: ${filePath}`, error)
    return null
  }
}

async function importAIHubData(dataDir: string, limit: number = 100) {
  try {
    const files = await fs.readdir(dataDir)
    const jsonFiles = files.filter(f => f.endsWith('.json')).slice(0, limit)

    console.log(`총 ${jsonFiles.length}개 파일 처리 시작...`)

    let successCount = 0
    let failCount = 0

    for (const file of jsonFiles) {
      const filePath = path.join(dataDir, file)
      const problemData = await parseAIHubFile(filePath)

      if (problemData) {
        try {
          await prisma.problem.create({
            data: problemData,
          })
          successCount++
          console.log(`✓ ${file} - Level ${problemData.level}, ${problemData.difficulty}`)
        } catch (error) {
          console.error(`DB 저장 실패: ${file}`, error)
          failCount++
        }
      } else {
        failCount++
      }
    }

    console.log(`\n완료!`)
    console.log(`성공: ${successCount}개`)
    console.log(`실패: ${failCount}개`)
  } catch (error) {
    console.error('데이터 임포트 실패:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 실행
const dataDir = path.join(__dirname, '../../data/raw/middle1')
const limit = parseInt(process.argv[2] || '100')

importAIHubData(dataDir, limit)
