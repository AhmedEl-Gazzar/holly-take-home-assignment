import jobs from '../../data/job-descriptions.json'
import { JURISDICTION_ALIASES, STOPWORDS } from './constants'
import { Jurisdiction } from './types'

function tokenize(text: string) {
  if (!text) return []

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Remove special characters
    .split(/\s+/) // Split by whitespace
    .filter(t => t && !STOPWORDS.has(t)) // Remove empty strings and "stop words"
}

function scoreTokenMatch(tokensA: string[], tokensB: string[]) {
  const setB = new Set(tokensB)
  let count = 0

  for (const token of tokensA) {
    if (setB.has(token)) count++
  }
  return count
}

export function jobSearch(message: string) {
  const tokens = tokenize(message)

  const results = jobs
    .map(job => {
      const titleTokens = tokenize(job.title)
      const jurisdictionTokens = tokenize(
        JURISDICTION_ALIASES[job.jurisdiction as Jurisdiction]
      )
      const descriptionTokens = tokenize(job.description)

      const titleScore = scoreTokenMatch(tokens, titleTokens) * 6
      const jurisdictionScore = scoreTokenMatch(tokens, jurisdictionTokens) * 3
      const descriptionScore = scoreTokenMatch(tokens, descriptionTokens) * 1

      return {
        jobId: job.code,
        titleScore: titleScore,
        jurisdictionScore: jurisdictionScore,
        descriptionScore: descriptionScore,
        totalScore: titleScore + jurisdictionScore + descriptionScore,
      }
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .filter(result => result.totalScore > 0)

  if (results.length === 0) {
    throw new Error(
      'No job descriptions found that match your search criteria. Explain the job you are looking for in more detail and try again.'
    )
  }

  if (results.length > 1 && results[0].totalScore === results[1].totalScore) {
    throw new Error(
      'Multiple job descriptions match your search criteria. Please provide more specific details.'
    )
  }

  return results[0]
}
