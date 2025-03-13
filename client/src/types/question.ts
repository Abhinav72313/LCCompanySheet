
export interface Question {
  _id: string
  Title: string
  Link: string
  Difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  Topics: string[]
  Frequency: number
  'Acceptance Rate': number
  Company: string
}

