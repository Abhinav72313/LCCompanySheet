
import { CompanyList } from "@/components/company-list";
import db from "@/lib/mongodb";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {

  let companiesWithProgress: { name: string; questionCount: number; questionIds: string[] }[] = []

  try {
    // Get companies with their question counts and question IDs using aggregation
    const pipeline = [
      {
        $group: {
          _id: "$Company",
          count: { $sum: 1 },
          questionIds: { $push: { $toString: "$_id" } }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          questionCount: "$count",
          questionIds: "$questionIds"
        }
      },
      {
        $sort: { name: 1 }
      }
    ]
    
    companiesWithProgress = await db
      .collection("company_wise")
      .aggregate(pipeline)
      .toArray() as { name: string; questionCount: number; questionIds: string[] }[]
      
  } catch (error) {
    console.error(error)
  }
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center max-sm:text-3xl">Company Interview Questions Tracker</h1>
      <p className="text-lg text-muted-foreground mb-10 text-center max-w-2xl mx-auto">
        Select a company to view their interview questions, including difficulty levels, topics, frequency, and
        acceptance rates.
      </p>

      <Link href={'https://github.com/Abhinav72313/LCCompanySheet'} target="_blank" className="hover:text-blue-500 max-sm:h-32 shadow-lg text-white  border-2 h-36 w-56 absolute bg-black cursor-pointer -top-12 -right-24 p-4 rotate-45 flex flex-col items-center justify-end">
        <GithubIcon className="h-10 w-10 " />
      </Link>

      <CompanyList companiesWithProgress={companiesWithProgress} />


    </main>
  )
}

