import { WeeklyReport } from "@/components/reports/weekly-report";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold font-headline">Reports</h1>
       <WeeklyReport />
    </div>
  )
}
