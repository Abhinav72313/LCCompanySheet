'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Progress } from "./ui/progress"

interface CompanyData {
  name: string
  totalQuestions: number
  completedQuestions: number
}

interface CompanyListProps {
  companiesWithProgress: { name: string; questionCount: number; questionIds: string[] }[]
}

export function CompanyList({ companiesWithProgress }: CompanyListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [companyData, setCompanyData] = useState<CompanyData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const calculateProgress = () => {
      try {
        // Calculate progress for each company based on actual question IDs from props
        const progressData = companiesWithProgress.map((company) => {
          const completedCount = company.questionIds?.filter((questionId: string) => 
            localStorage.getItem(questionId) === 'true'
          ).length || 0
          
          return {
            name: company.name,
            totalQuestions: company.questionCount,
            completedQuestions: completedCount
          }
        })
        
        setCompanyData(progressData)
      } catch (error) {
        console.error('Error calculating company progress:', error)
        // Fallback to basic data from props
        setCompanyData(companiesWithProgress.map(company => ({
          name: company.name,
          totalQuestions: company.questionCount,
          completedQuestions: 0
        })))
      } finally {
        setIsLoading(false)
      }
    }

    calculateProgress()
    
    // Update progress when localStorage changes (when user completes questions)
    const handleStorageChange = () => {
      calculateProgress()
    }
    
    // Listen for custom events when questions are completed
    const handleQuestionCompleted = () => {
      calculateProgress()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('questionCompleted', handleQuestionCompleted)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('questionCompleted', handleQuestionCompleted)
    }
  }, [companiesWithProgress])

  const filteredCompanies = companyData.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  
  
  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {isLoading ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            Loading company data...
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No companies found matching your search.
          </div>
        ) : (
          filteredCompanies.map((company) => {
            const progressPercentage = company.totalQuestions > 0 
              ? Math.round((company.completedQuestions / company.totalQuestions) * 100)
              : 0
             
            return (
            <Link key={company.name} href={`/company/${encodeURIComponent(company.name)}`} className="transition-transform hover:scale-105">
              <Card className="h-full hover:shadow-md transition-shadow relative overflow-clip">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold">{company.name}</CardTitle>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{company.totalQuestions} Questions</Badge>
                    <span className="text-sm text-muted-foreground">
                      {company.completedQuestions}/{company.totalQuestions}
                    </span>
                  </div>
                  {company.totalQuestions > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progressPercentage}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
          })
        )}
    </div>
    </div>
  )
}

