'use client'

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {  ChevronRight } from "lucide-react"
import { useState } from "react"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"

interface CompanyListProps {
  companies: string[]
}

export function CompanyList({ companies }: CompanyListProps) {

  const [searchQuery, setSearchQuery] = useState("")

  const filteredCompanies = companies.filter((company) =>
    company.toLowerCase().includes(searchQuery.toLowerCase()),
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
    {filteredCompanies.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No companies found matching your search.
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <Link key={company} href={`/company/${company}`} className="transition-transform hover:scale-105">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold">{company}</CardTitle>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{company} Questions</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
    </div>
    </div>
  )
}

