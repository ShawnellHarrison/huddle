"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DollarSign,
  Users,
  CheckCircle,
  TrendingUp,
  BarChart,
  ArrowUp,
  Calendar
} from "lucide-react"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts"
import { weeklyReportData } from "@/lib/mock-data"

const chartConfig = {
  tasks: {
    label: "Tasks Completed",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function WeeklyReport() {
  const {
    weekOf,
    revenue,
    newClients,
    tasksCompleted,
    topPerformer,
    taskTrend,
  } = weeklyReportData

  return (
    <Card className="cozy-panel overflow-hidden">
      <CardHeader className="p-6 bg-secondary/30">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-2xl font-headline">Weekly Report</CardTitle>
            <CardDescription>Week of {weekOf}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-secondary/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenue.amount.toLocaleString()}</div>
              <p className="text-xs text-green-500 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                {revenue.change}% from last week
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{newClients.count}</div>
              <p className="text-xs text-muted-foreground">
                {newClients.change}% from last week
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksCompleted.count}</div>
               <p className="text-xs text-muted-foreground">
                Goal: {tasksCompleted.goal}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
           <Card className="h-full flex flex-col bg-secondary/50">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Daily Task Completion
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <ChartContainer config={chartConfig} className="w-full h-full min-h-[200px]">
                    <RechartsBarChart accessibilityLayer data={taskTrend}>
                        <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        stroke="hsl(var(--muted-foreground))"
                        tickMargin={4}
                        fontSize={12}
                        />
                        <YAxis hide={true} />
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideIndicator />}
                        />
                        <Bar
                        dataKey="tasks"
                        fill="var(--color-tasks)"
                        radius={5}
                        />
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-secondary/30">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-accent" />
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Top Performer this week:</span> {topPerformer}
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
