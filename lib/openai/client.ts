import OpenAI from 'openai'
import type { PortfolioRequest, PortfolioResult } from '@/types'
import { PortfolioResultSchema, portfolioJsonSchema } from './schema'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 25000,
})

export async function generatePortfolio(
  req: PortfolioRequest
): Promise<PortfolioResult> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(req) },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: portfolioJsonSchema,
    },
    temperature: 0.7,
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) throw new Error('OpenAI 응답이 비어있습니다')

  const parsed = JSON.parse(raw)
  const result = PortfolioResultSchema.parse(parsed)
  return result
}
