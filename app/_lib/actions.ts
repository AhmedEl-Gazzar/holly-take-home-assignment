'use server'

import { jobSearch } from './jobSearch'
import salaries from '../../data/salaries.json'
import jobs from '../../data/job-descriptions.json'
import { JURISDICTION_ALIASES } from './constants'
import { Jurisdiction } from './types'

export async function sendChatMessage(formData: { message: string }) {
  const message = formData.message.trim()
  if (!message || typeof message !== 'string') {
    throw new Error('Invalid input')
  }

  const result = jobSearch(message)

  // Intent detection logic can be added here if needed

  //prepare relevant data for LLM call

  const job = jobs.find(job => job.code === result.jobId)!
  const salaryMatch = salaries.find(salary => salary['Job Code'] === job.code)

  const structuredJob = {
    title: job.title,
    description: job.description,
    jurisdiction: JURISDICTION_ALIASES[job.jurisdiction as Jurisdiction],
    salary: salaryMatch
      ? {
          salaryGrade1: salaryMatch['Salary grade 1'],
          salaryGrade2: salaryMatch['Salary grade 2'],
          salaryGrade3: salaryMatch['Salary grade 3'],
          salaryGrade4: salaryMatch['Salary grade 4'],
          salaryGrade5: salaryMatch['Salary grade 5'],
          salaryGrade6: salaryMatch['Salary grade 6'],
          salaryGrade7: salaryMatch['Salary grade 7'],
          salaryGrade8: salaryMatch['Salary grade 8'],
          salaryGrade9: salaryMatch['Salary grade 9'],
          salaryGrade10: salaryMatch['Salary grade 10'],
          salaryGrade11: salaryMatch['Salary grade 11'],
          salaryGrade12: salaryMatch['Salary grade 12'],
          salaryGrade13: salaryMatch['Salary grade 13'],
          salaryGrade14: salaryMatch['Salary grade 14'],
        }
      : undefined,
  }

  //LLM Call

  return {
    job: structuredJob,
    searchResult: result,
  }
}
