import { z } from 'zod'

const AssetClassEnum = z.enum([
  '국내주식',
  '해외ETF',
  '채권',
  '리츠',
  '금',
  '현금성',
])

export const PortfolioResultSchema = z.object({
  risk_label: z.string().min(1),
  risk_description: z.string().min(1),
  allocations: z
    .array(
      z.object({
        asset_class: AssetClassEnum,
        ratio: z.number().int().min(0).max(100),
        description: z.string().min(1),
      })
    )
    .min(1)
    .refine(
      (items) => items.reduce((sum, i) => sum + i.ratio, 0) === 100,
      { message: 'allocations ratio 합계가 100이어야 합니다' }
    ),
  reasoning: z.string().min(1),
  risk_indicators: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1),
    })
  ),
  behavior_advice: z.string().min(1),
  summary: z.string().min(1),
})

// OpenAI 요청 입력 검증 스키마 (API route에서 사용)
export const PortfolioRequestSchema = z.object({
  risk_level: z.enum([
    'very_conservative',
    'conservative',
    'moderate',
    'aggressive',
    'very_aggressive',
  ]),
  monthly_investment: z.number().nonnegative(),
  investment_period_years: z.number().positive(),
  loss_tolerance_pct: z.number().min(0).max(100),
  behavior_profile: z.object({
    involvement: z.enum([
      'active',
      'semi_active',
      'semi_passive',
      'passive',
      'full_passive',
    ]),
    return_type: z.enum([
      'growth',
      'growth_income',
      'balanced',
      'income_growth',
      'income',
    ]),
    fomo_type: z.enum([
      'relative_loss',
      'exclusion',
      'cash_regret',
      'social_pressure',
      'low_fomo',
    ]),
  }),
})

// OpenAI Structured Outputs용 JSON Schema
export const portfolioJsonSchema = {
  name: 'portfolio_result',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      risk_label: { type: 'string' },
      risk_description: { type: 'string' },
      allocations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            asset_class: {
              type: 'string',
              enum: ['국내주식', '해외ETF', '채권', '리츠', '금', '현금성'],
            },
            ratio: { type: 'integer' },
            description: { type: 'string' },
          },
          required: ['asset_class', 'ratio', 'description'],
          additionalProperties: false,
        },
      },
      reasoning: { type: 'string' },
      risk_indicators: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            value: { type: 'string' },
          },
          required: ['label', 'value'],
          additionalProperties: false,
        },
      },
      behavior_advice: { type: 'string' },
      summary: { type: 'string' },
    },
    required: [
      'risk_label',
      'risk_description',
      'allocations',
      'reasoning',
      'risk_indicators',
      'behavior_advice',
      'summary',
    ],
    additionalProperties: false,
  },
}
