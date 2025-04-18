"use client"

import { CheckCircle, AlertCircle } from "lucide-react"
import type { ComplianceReport as ComplianceReportType } from "@/types"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ComplianceReportProps {
  report: ComplianceReportType
  onReset: () => void
}

export default function ComplianceReport({ report, onReset }: ComplianceReportProps) {
  const items = report.items || []
  const isCompliant = items.every((item) => item.status === "pass")

  const summary = report.summary || {
    passCount: items.filter((item) => item.status === "pass").length,
    failCount: items.filter((item) => item.status === "fail").length,
  }

  // Calculate compliance score percentage
  const totalRules = summary.passCount + summary.failCount
  const complianceScore = totalRules > 0 ? Math.round((summary.passCount / totalRules) * 100) : 0

  // Group items by status for better organization
  const passedItems = items.filter((item) => item.status === "pass")
  const failedItems = items.filter((item) => item.status === "fail")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">IEEE Compliance Report</h2>
        <Button
  variant="outline"
  onClick={onReset}
  className="border-none mt-4 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-zinc-900 font-medium rounded-lg cursor-pointer transition-colors duration-200"
>
  Check Another PDF
</Button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="relative mb-2">
            <svg className="w-24 h-24" viewBox="0 0 100 100">
              <circle
                className="text-zinc-700"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className={`${isCompliant ? "text-emerald-400" : complianceScore > 50 ? "text-amber-400" : "text-red-400"}`}
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * complianceScore) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{complianceScore}%</span>
            </div>
          </div>
          <h3 className="text-lg font-medium">Compliance Score</h3>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              
              <div>
                <p className="text-sm text-zinc-400">Passed Rules</p>
                <p className="text-xl font-semibold">{summary.passCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              
              <div>
                <p className="text-sm text-zinc-400">Failed Rules</p>
                <p className="text-xl font-semibold">{summary.failCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Compliance Status</h3>
          <div className="flex flex-col h-[calc(100%-2rem)] justify-center">
            {isCompliant ? (
              <div className="flex items-center gap-3 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                
                <p className="text-emerald-300 font-medium">This document is fully IEEE compliant</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                
                <p className="text-red-300 font-medium">This document is not IEEE compliant</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {failedItems.length > 0 && (
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-medium mb-4 text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Failed Rules
          </h3>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700">
                <TableHead className="text-zinc-300">Rule</TableHead>
                <TableHead className="text-zinc-300">Issue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failedItems.map((item, index) => (
                <TableRow key={index} className="border-zinc-700">
                  <TableCell className="font-medium text-zinc-200">{item.rule}</TableCell>
                  <TableCell className="text-red-400">{item.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4 text-emerald-400 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Passed Rules
        </h3>
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-700">
              <TableHead className="text-zinc-300">Rule</TableHead>
              <TableHead className="text-zinc-300">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {passedItems.map((item, index) => (
              <TableRow key={index} className="border-zinc-700">
                <TableCell className="font-medium text-zinc-200">{item.rule}</TableCell>
                <TableCell className="text-emerald-400">{item.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}
