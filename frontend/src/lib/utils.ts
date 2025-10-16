import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind 클래스를 병합하고 충돌을 해결합니다.
 * clsx로 조건부 클래스를 처리하고, twMerge로 충돌 해결
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-4가 우선)
 * cn('text-red-500', isActive && 'text-blue-500') // => 조건부 적용
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
