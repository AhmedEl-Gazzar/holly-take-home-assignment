import jobs from '../../data/job-descriptions.json'
import salaries from '../../data/salaries.json'
import { JURISDICTION_ALIASES, STOPWORDS } from './constants'
import { Jurisdiction, StructuredJob } from './types'

function tokenize(text: string) {
  if (!text) return []

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Remove special characters
    .split(/\s+/) // Split by whitespace
    .filter(t => t && !STOPWORDS.has(t)) // Remove empty strings and "stop words"
}

const processedJobs = jobs.map(job => ({
  ...job,
  tokens: {
    title: tokenize(job.title),
    jurisdiction: tokenize(
      JURISDICTION_ALIASES[job.jurisdiction as Jurisdiction]
    ),
    description: tokenize(job.description),
  },
}))

function scoreTokenMatch(tokensA: string[], tokensB: string[]) {
  const setB = new Set(tokensB)
  let count = 0

  for (const token of tokensA) {
    if (setB.has(token)) count++
  }
  return count
}

function structureJob(jobCode: string) {
  const job = jobs.find(job => job.code === jobCode)
  if (!job) {
    throw new Error(`Job code ${jobCode} not found`)
  }

  const salary = salaries.find(salary => salary['Job Code'] === jobCode)

  return {
    title: job.title,
    description: job.description,
    jurisdiction: JURISDICTION_ALIASES[job.jurisdiction as Jurisdiction],
    salary: salary
      ? {
          1: salary['Salary grade 1'],
          2: salary['Salary grade 2'],
          3: salary['Salary grade 3'],
          4: salary['Salary grade 4'],
          5: salary['Salary grade 5'],
          6: salary['Salary grade 6'],
          7: salary['Salary grade 7'],
          8: salary['Salary grade 8'],
          9: salary['Salary grade 9'],
          10: salary['Salary grade 10'],
          11: salary['Salary grade 11'],
          12: salary['Salary grade 12'],
          13: salary['Salary grade 13'],
          14: salary['Salary grade 14'],
        }
      : undefined,
  } as StructuredJob
}

export function jobSearch(message: string) {
  const messageTokens = tokenize(message)

  const results = processedJobs
    .map(job => {
      const titleScore = scoreTokenMatch(messageTokens, job.tokens.title) * 6
      const jurisdictionScore =
        scoreTokenMatch(messageTokens, job.tokens.jurisdiction) * 3
      const descriptionScore =
        scoreTokenMatch(messageTokens, job.tokens.description) * 1

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

  return structureJob(results[0].jobId)
}
