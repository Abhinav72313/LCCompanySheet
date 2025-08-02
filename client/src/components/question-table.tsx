"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Question } from "@/types/question"
import { ChevronDown, ExternalLink, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Progress } from "./ui/progress"

interface QuestionTableProps {
  questions: Question[]
}

export function QuestionTable({ questions }: QuestionTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Question | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [isChecked, setIsChecked] = useState(false)
  const [searchTopics,setSearchTopics] = useState<string[]>([])
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([])

  // Initialize client-side state after hydration
  useEffect(() => {
    const completed = questions
      .filter((question) => localStorage.getItem(question._id))
      .map((question) => question._id)
    setCompletedQuestions(completed)
  }, [questions])

  const handleSort = (column: keyof Question) => {
    
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleCheckboxChange = (questionId: string, isCheck: boolean) => {
    setIsChecked(!isChecked)
    if(isCheck) {
      localStorage.setItem(questionId,'true')
      setCompletedQuestions(prev => [...prev, questionId])
    } else {
      localStorage.removeItem(questionId)
      setCompletedQuestions(prev => prev.filter(id => id !== questionId))
    }
    
    // Trigger custom event to update company progress
    window.dispatchEvent(new CustomEvent('questionCompleted'))
  }

  const filteredQuestions = questions.filter(
    (question) =>{
      if(searchQuery === '' && searchTopics.length === 0) return true
      if(searchQuery !== '' && searchTopics.length === 0) return question.Title.toLowerCase().includes(searchQuery.toLowerCase()) || question.Topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      if(searchQuery === '' && searchTopics.length !== 0) return question.Topics.some((topic) => searchTopics.includes(topic))
      if(searchQuery !== '' && searchTopics.length !== 0) return question.Title.toLowerCase().includes(searchQuery.toLowerCase()) && question.Topics.some((topic) => searchTopics.includes(topic))
    },
  )

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (!sortColumn) return 0
    // Special handling for Difficulty column
    if (sortColumn === "Difficulty") {
      
      
      const aValue = a.Difficulty === 'EASY' ? 1 : a.Difficulty === 'MEDIUM' ? 2 : 3
      const bValue = b.Difficulty === 'EASY' ? 1 : b.Difficulty === 'MEDIUM' ? 2 : 3
      
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    // Handle other columns
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const getDifficultyColor = (Difficulty: string) => {
    switch (Difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "hard":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const percentage = Math.round((completedQuestions.length / questions.length) * 100)

  return (
    <div>
      <div className="mb-4 space-y-2">
        <Input
          type="text"
          placeholder="Search questions by Title or Topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Progress value={percentage} />
        <div className="flex flex-wrap gap-2">
          {searchTopics.map((Topic) => (
            <Badge key={Topic} variant="outline" onClick={()=>{
              setSearchTopics(searchTopics.filter((item) => item !== Topic))
            }} className=" cursor-pointer hover:bg-primary/20 bg-primary text-primary-foreground">
              <X className="h-4 w-4 " />
              {Topic}
            </Badge>
          ))}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="w-[300px]">
                <Button variant="ghost" onClick={() => handleSort("Title")} className="font-semibold">
                  Title
                  {sortColumn === "Title" && (
                    <ChevronDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>Link</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("Difficulty")} className="font-semibold">
                  Difficulty
                  {sortColumn === "Difficulty" && (
                    <ChevronDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>Topics</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("Frequency")} className="font-semibold">
                  Frequency
                  {sortColumn === "Frequency" && (
                    <ChevronDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("Acceptance Rate")} className="font-semibold">
                  Acceptance Rate
                  {sortColumn === "Acceptance Rate" && (
                    <ChevronDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No questions found matching your search
                </TableCell>
              </TableRow>
            ) : (
              sortedQuestions.map((question) => (
                <TableRow key={question._id}>
                  <TableCell>
                    <Checkbox
                      className="cursor-pointer"
                      checked={completedQuestions.includes(question._id)}
                      onCheckedChange={(e:boolean) => handleCheckboxChange(question._id,e)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{question.Title}</TableCell>
                  <TableCell>
                    <Link
                      href={question.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      View <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </TableCell>
                  <TableCell >
                    <Badge variant="secondary" className={getDifficultyColor(question.Difficulty)}>
                      {question.Difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {question.Topics.map((Topic) => (
                        <Badge key={Topic} variant="outline" onClick={()=>{
                          if(searchTopics.includes(Topic)){
                            setSearchTopics(searchTopics.filter((item) => item !== Topic))
                          }else{
                            setSearchTopics([...searchTopics,Topic])
                          }
                        }} className={`text-xs cursor-pointer hover:bg-primary/20 ${searchTopics.includes(Topic) ? 'bg-primary text-secondary' : 'text-primary'}`}>
                          {Topic}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Progress value={question.Frequency} />
                    {/* <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${question.Frequency}%` }}></div>
                    </div> */}
                    <span className="text-xs text-muted-foreground">{question.Frequency}%</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        question['Acceptance Rate'] < 40
                          ? "text-red-600"
                          : question['Acceptance Rate'] > 70
                            ? "text-green-600"
                            : ""
                      }
                    >
                      {Math.round(Number(question['Acceptance Rate']) * 100)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

