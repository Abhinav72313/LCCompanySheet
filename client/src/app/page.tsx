

import { CompanyList } from "@/components/company-list"

export default async function Home() {

  let companies = []

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company_list`)
    companies = await res.json()

  } catch (error) {
    console.error(error)

  }
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Company Interview Questions Tracker</h1>
      <p className="text-lg text-muted-foreground mb-10 text-center max-w-2xl mx-auto">
        Select a company to view their interview questions, including difficulty levels, topics, frequency, and
        acceptance rates.
      </p>


      <CompanyList companies={companies} />
    </main>
  )
}

