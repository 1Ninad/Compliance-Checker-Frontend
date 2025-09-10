"use client"

import { CheckCircle, XCircle, FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { ComplianceReport as ComplianceReportType } from "@/types"

interface ComplianceReportProps {
  report: ComplianceReportType | null
  fileName: string
  onReset: () => void
}

export function ComplianceReport({ report, fileName, onReset }: ComplianceReportProps) {
  if (!report) {
    return (
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-muted-foreground">No report data available</p>
        <Button onClick={onReset} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    )
  }

  const failedItems = report.items.filter((item) => item.status === "fail")
  const passedItems = report.items.filter((item) => item.status === "pass")

  const totalChecks = report.items.length
  const passedChecks = passedItems.length
  const failedChecks = failedItems.length

  const overallScore = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            Pass
          </Badge>
        )
      case "fail":
        return <Badge variant="destructive">Fail</Badge>
      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onReset}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Compliance Report</h1>
            <p className="text-muted-foreground">{fileName}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">{overallScore}%</div>
          <p className="text-sm text-muted-foreground">Overall Score</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Analysis Summary
          </CardTitle>
          <CardDescription>Your document has been analyzed against IEEE formatting standards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Compliance Progress</span>
            <span>
              {passedChecks} of {totalChecks} checks passed
            </span>
          </div>
          <Progress value={overallScore} className="h-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{passedChecks}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{failedChecks}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {failedChecks > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-600">Failed Checks ({failedChecks})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {failedItems.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3 p-3 rounded-lg border bg-card/50">
                    <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{item.rule}</h4>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {passedChecks > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-600">Passed Checks ({passedChecks})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {passedItems.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3 p-3 rounded-lg border bg-card/50">
                    <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{item.rule}</h4>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}