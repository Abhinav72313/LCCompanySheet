

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuestionTable } from "@/components/question-table"

import { ArrowLeft } from "lucide-react"
import { Question } from "@/types/question"


export default async function CompanyPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/${name}`)
  const companyQuestions: Question[] = await res.json()
  companyQuestions.forEach((question) => {
    question.Frequency = Number(question.Frequency)
  })


  return (
    <main className="container mx-auto py-10 px-4">

      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">{companyQuestions[0].Company.toUpperCase()}</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Interview Questions</h2>
        <p className="text-muted-foreground">
          {companyQuestions.length} questions found for {companyQuestions[0].Company}
        </p>
      </div>


      <QuestionTable questions={companyQuestions} />
    </main>
  )
}

