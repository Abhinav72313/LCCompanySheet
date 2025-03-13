

import { CompanyList } from "@/components/company-list"

import { Skeleton } from "@/components/ui/skeleton"

export default async function Home() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company_list`,{
    cache:'force-cache'
  })
  const companies = await res.json()

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Company Interview Questions Tracker</h1>
      <p className="text-lg text-muted-foreground mb-10 text-center max-w-2xl mx-auto">
        Select a company to view their interview questions, including difficulty levels, topics, frequency, and
        acceptance rates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-full" />

      </div>

      <CompanyList companies={companies} />
    </main>
  )
}

