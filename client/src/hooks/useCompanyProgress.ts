'use client'

import { useEffect, useState } from 'react'

interface CompanyProgress {
  name: string
  totalQuestions: number
  completedQuestions: number
  progressPercentage: number
}

export function useCompanyProgress(companiesWithCounts: { name: string; questionCount: number }[]) {
  const [companyProgress, setCompanyProgress] = useState<CompanyProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const calculateProgress = async () => {
      try {
        // For each company, we need to fetch their questions and check localStorage
        const progressData = await Promise.all(
          companiesWithCounts.map(async (company) => {
            try {
              // Make a simple fetch to get question IDs for this company
              const response = await fetch(`/api/company/${company.name}`)
              if (!response.ok) {
                throw new Error('Failed to fetch')
              }
              
              const questions = await response.json()
              
              // Count completed questions from localStorage
              const completedCount = questions.filter((q: { _id: string }) => 
                localStorage.getItem(q._id)
              ).length
              
              const progressPercentage = company.questionCount > 0 
                ? Math.round((completedCount / company.questionCount) * 100)
                : 0

              return {
                name: company.name,
                totalQuestions: company.questionCount,
                completedQuestions: completedCount,
                progressPercentage
              }
            } catch (error) {
              console.error(`Error fetching data for ${company.name}:`, error)
              return {
                name: company.name,
                totalQuestions: company.questionCount,
                completedQuestions: 0,
                progressPercentage: 0
              }
            }
          })
        )
        
        setCompanyProgress(progressData)
      } catch (error) {
        console.error('Error calculating company progress:', error)
        // Fallback to basic data without progress
        setCompanyProgress(
          companiesWithCounts.map(company => ({
            name: company.name,
            totalQuestions: company.questionCount,
            completedQuestions: 0,
            progressPercentage: 0
          }))
        )
      } finally {
        setIsLoading(false)
      }
    }

    if (companiesWithCounts.length > 0) {
      calculateProgress()
    }
  }, [companiesWithCounts])

  return { companyProgress, isLoading }
}
