"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export function ChartAreaInteractive() {
  const [selectedChart, setSelectedChart] = useState("population")

  const charts = {
    population: {
      title: "Population Distribution",
      description: "Breakdown by age groups"
    },
    income: {
      title: "Income Analysis", 
      description: "Household income ranges"
    },
    education: {
      title: "Education Levels",
      description: "Educational attainment"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{charts[selectedChart as keyof typeof charts].title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {charts[selectedChart as keyof typeof charts].description}
          </p>
        </div>
        <Select value={selectedChart} onValueChange={setSelectedChart}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chart" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="population">Population</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Chart visualization would appear here
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Showing {charts[selectedChart as keyof typeof charts].title.toLowerCase()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
