import { QuestionTable } from "@/components/question-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import db from "@/lib/mongodb"
import { Question } from "@/types/question"
import { ArrowLeft } from "lucide-react"


export async function generateStaticParams() {
  try {
    const companies = await db
      .collection("company_wise")
      .distinct("Company");

    return companies.map((name) => ({ name }));

  } catch (e) {
    console.error(e);
    return []
  }
}


export default async function CompanyPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  let companyQuestions: Question[] = []

  try {
    // Query database directly for SSG instead of using fetch
    const results = await db
      .collection("company_wise")
      .find({ Company: decodedName })
      .toArray()
    
    companyQuestions = results.map((doc) => ({
      ...doc,
      _id: doc._id?.toString() || '',
    })) as Question[]

  } catch (error) {
    console.error(error)
    return <div>No Questions Found for this Company</div>
  }

  companyQuestions.forEach((question) => {
    question.Frequency = Number(question.Frequency)
  })


  if (companyQuestions.length === 0) {
    return <div>No Questions Found for this Company</div>
  }
  return (
    <main className="container mx-auto py-10 px-4">

      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">{decodedName.toUpperCase()}</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Interview Questions</h2>
        <p className="text-muted-foreground">
          {companyQuestions.length} questions found for {decodedName}
        </p>
      </div>


      <QuestionTable questions={companyQuestions} />
    </main>
  )
}

