import type { SessionData } from '@/types'

const SESSION_KEY = 'portfolioai_session'

export function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as SessionData) : null
  } catch {
    return null
  }
}

export function setSession(data: SessionData): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SESSION_KEY)
}

export function hasCompletedOnboarding(): boolean {
  const session = getSession()
  return session !== null && session.riskLevel !== undefined
}
