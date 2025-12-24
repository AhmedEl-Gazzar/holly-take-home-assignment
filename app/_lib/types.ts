import { JURISDICTION_ALIASES } from './constants'

export type Jurisdiction = keyof typeof JURISDICTION_ALIASES

type SalaryGrades = Record<
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14,
  string
>

export type StructuredJob = {
  title: string
  description: string
  jurisdiction: string
  salary?: SalaryGrades
}
