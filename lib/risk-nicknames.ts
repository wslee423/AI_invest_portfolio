import type { RiskLevel } from '@/types'

export const RISK_NICKNAMES: Record<RiskLevel, { nickname: string; emoji: string; tagline: string }> = {
  very_conservative: {
    nickname: '난 탱커야',
    emoji: '🛡️',
    tagline: '손실은 없다. 절대로.',
  },
  conservative: {
    nickname: '안전이 최고야',
    emoji: '🏦',
    tagline: '천천히, 그러나 확실하게.',
  },
  moderate: {
    nickname: '균형이 답이야',
    emoji: '⚖️',
    tagline: '수익도 챙기고, 잠도 잔다.',
  },
  aggressive: {
    nickname: '가즈아!',
    emoji: '🚀',
    tagline: '리스크? 그게 곧 기회잖아.',
  },
  very_aggressive: {
    nickname: '몰빵 장인',
    emoji: '🔥',
    tagline: '올라가거나, 배우거나.',
  },
}
