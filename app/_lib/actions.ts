'use server'

import { jobSearch } from './job-search'
import { answerQuestion } from './gemini'
import { z } from 'zod'

const inputSchema = z.object({
  userInput: z.string().min(1, 'Input cannot be empty'),
})

export async function sendChatMessage({ userInput }: { userInput: string }) {
  const { userInput: validatedInput } = inputSchema.parse({ userInput })

  const job = jobSearch(validatedInput)

  const answer = await answerQuestion({
    question: validatedInput,
    jobData: job,
  })

  return {
    answer,
  }
}
