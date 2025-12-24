import { ApiError, GoogleGenAI } from '@google/genai'
import { SYSTEM_INSTRUCTIONS } from './constants'
import { StructuredJob } from './types'
import { z } from 'zod'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
})

const answerSchema = z.object({
  status: z.enum(['success', 'error']).describe('The status of the answer'),
  result: z.string().describe('The answer to the question'),
  error: z
    .string()
    .optional()
    .describe('The error message if the status is "error"'),
})

export async function answerQuestion({
  question,
  jobData,
}: {
  question: string
  jobData: StructuredJob
}) {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL!,
      contents: {
        role: 'user',
        parts: [
          {
            text: `Question: ${question}`,
          },
          {
            text: `Job Data: ${JSON.stringify(jobData)},`,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        responseMimeType: 'application/json',
        responseJsonSchema: answerSchema.toJSONSchema(),
      },
    })

    if (!response.text) {
      throw new Error('No response text received from the Gemeini model')
    }

    const answer = answerSchema.parse(JSON.parse(response.text))
    console.log('gemini response', answer)

    if (answer.status === 'error') {
      console.error('Error in answer:', answer.error)
    }
    return answer.result
  } catch (e) {
    if (e instanceof ApiError) {
      console.error('Gemini API error:', e)
      throw new Error(e.message)
    } else {
      console.error('Unexpected error:', e)
      throw new Error((e as Error).message)
    }
  }
}
