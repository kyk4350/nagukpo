import apiClient from './client'

export interface HintResponse {
  hint: string
  level: 1 | 2 | 3
}

export async function getHint(problemId: string, level: 1 | 2 | 3): Promise<HintResponse> {
  const response = await apiClient.post(`/problems/${problemId}/hint`, { level })
  return response.data.data
}
