import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '15m'
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d'
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12')

interface RegisterData {
  username: string
  email: string
  password: string
  birthYear: number
  parentEmail?: string
}

interface LoginData {
  email: string
  password: string
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/**
 * 비밀번호를 bcrypt로 해싱합니다.
 */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

/**
 * 비밀번호를 검증합니다.
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * JWT Access Token을 생성합니다.
 */
function generateAccessToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
}

/**
 * JWT Refresh Token을 생성합니다.
 */
function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION })
}

/**
 * JWT Token을 검증합니다.
 */
function verifyAccessToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string }
}

/**
 * Refresh Token을 검증합니다.
 */
function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string }
}

/**
 * 회원가입 - 새 사용자를 생성합니다.
 */
async function register(data: RegisterData): Promise<{ user: Omit<User, 'passwordHash'>, tokens: AuthTokens }> {
  // 이메일 중복 체크
  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email }
  })
  if (existingEmail) {
    throw new Error('이미 사용 중인 이메일입니다')
  }

  // 사용자명 중복 체크
  const existingUsername = await prisma.user.findUnique({
    where: { username: data.username }
  })
  if (existingUsername) {
    throw new Error('이미 사용 중인 사용자명입니다')
  }

  // 비밀번호 해싱
  const passwordHash = await hashPassword(data.password)

  // 사용자 생성
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
      birthYear: data.birthYear,
      parentEmail: data.parentEmail,
      lastLoginAt: new Date()
    }
  })

  // 비밀번호 히스토리 저장
  await prisma.passwordHistory.create({
    data: {
      userId: user.id,
      hashedPassword: passwordHash
    }
  })

  // 토큰 생성
  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  // Refresh Token 저장
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7일 후

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt
    }
  })

  // passwordHash 제외하고 반환
  const { passwordHash: _, ...userWithoutPassword } = user

  return {
    user: userWithoutPassword,
    tokens: {
      accessToken,
      refreshToken
    }
  }
}

/**
 * 로그인 - 자격증명을 검증하고 토큰을 발급합니다.
 */
async function login(data: LoginData): Promise<{ user: Omit<User, 'passwordHash'>, tokens: AuthTokens }> {
  // 사용자 조회
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  })

  if (!user) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
  }

  // 비밀번호 검증
  const isValidPassword = await verifyPassword(data.password, user.passwordHash)
  if (!isValidPassword) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
  }

  // 마지막 로그인 시간 업데이트
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  })

  // 토큰 생성
  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  // Refresh Token 저장
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7일 후

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt
    }
  })

  // passwordHash 제외하고 반환
  const { passwordHash: _, ...userWithoutPassword } = user

  return {
    user: userWithoutPassword,
    tokens: {
      accessToken,
      refreshToken
    }
  }
}

/**
 * 로그아웃 - Refresh Token을 삭제합니다.
 */
async function logout(refreshToken: string): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken }
  })
}

/**
 * Access Token을 갱신합니다.
 */
async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  // Refresh Token 검증
  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch (error) {
    throw new Error('유효하지 않은 Refresh Token입니다')
  }

  // DB에서 Refresh Token 확인
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken }
  })

  if (!storedToken) {
    throw new Error('Refresh Token을 찾을 수 없습니다')
  }

  // 만료 확인
  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: { id: storedToken.id }
    })
    throw new Error('만료된 Refresh Token입니다')
  }

  // 새 Access Token 생성
  const accessToken = generateAccessToken(payload.userId)

  return {
    accessToken,
    refreshToken // 기존 refresh token 재사용
  }
}

/**
 * 만료된 Refresh Token을 정리합니다 (Cron Job용)
 */
async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })

  return result.count
}

/**
 * 사용자 ID로 사용자를 조회합니다.
 */
async function getUserById(userId: string): Promise<Omit<User, 'passwordHash'> | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    return null
  }

  const { passwordHash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export default {
  register,
  login,
  logout,
  refreshAccessToken,
  cleanupExpiredTokens,
  getUserById,
  verifyAccessToken,
  verifyRefreshToken
}
