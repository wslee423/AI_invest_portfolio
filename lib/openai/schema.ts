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

export type PortfolioResultFromSchema = z.infer<typeof PortfolioResultSchema>

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
