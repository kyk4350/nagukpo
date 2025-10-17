import { Request, Response } from 'express'
import * as chatService from '../services/chat.service'
import logger from '../utils/logger'

/**
 * POST /api/v1/chat
 * 챗봇과 대화
 */
export async function sendMessage(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.',
      })
    }

    const { message, conversationHistory } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: '메시지를 입력해주세요.',
      })
    }

    const response = await chatService.chat({
      userId,
      message,
      conversationHistory,
    })

    res.json({
      success: true,
      data: response,
    })
  } catch (error) {
    logger.error('Chat controller error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '챗봇 응답 생성에 실패했습니다.',
    })
  }
}

/**
 * GET /api/v1/chat/history
 * 대화 히스토리 조회
 */
export async function getHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.',
      })
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50

    const history = await chatService.getChatHistory(userId, limit)

    res.json({
      success: true,
      data: { history },
    })
  } catch (error) {
    logger.error('Get chat history error:', error)
    res.status(500).json({
      success: false,
      error: '대화 히스토리 조회에 실패했습니다.',
    })
  }
}

/**
 * DELETE /api/v1/chat/history
 * 대화 히스토리 삭제
 */
export async function clearHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.',
      })
    }

    await chatService.clearChatHistory(userId)

    res.json({
      success: true,
      data: { message: '대화 히스토리가 삭제되었습니다.' },
    })
  } catch (error) {
    logger.error('Clear chat history error:', error)
    res.status(500).json({
      success: false,
      error: '대화 히스토리 삭제에 실패했습니다.',
    })
  }
}
