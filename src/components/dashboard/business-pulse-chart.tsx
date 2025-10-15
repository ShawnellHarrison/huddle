"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { businessPulseData } from "@/lib/mock-data"
import { TrendingUp } from "lucide-react"

const chartConfig = {
  Revenue: {
    label: "Revenue",
    color: "hsl(var(--brand))",
  },
  Tasks: {
    label: "Tasks",
    color: "hsl(var(--accent))",
  },
}

export function BusinessPulseChart() {
  return (
    <div className="cozy-panel">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <TrendingUp />
            Business Pulse
        </CardTitle>
        <CardDescription>Revenue and tasks completed this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={businessPulseData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="Revenue" fill="var(--color-Revenue)" radius={4} yAxisId="left" />
            <Bar dataKey="Tasks" fill="var(--color-Tasks)" radius={4} yAxisId="right"/>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
