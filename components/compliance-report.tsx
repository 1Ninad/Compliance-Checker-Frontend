import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { ComplianceReport as ComplianceReportType } from "@/types"

interface ComplianceReportProps {
  report: ComplianceReportType
}

export default function ComplianceReport({ report }: ComplianceReportProps) {
    

  const items = report.items || []

  const summary = report.summary || {
  passCount: items.filter((item) => item.status === "pass").length,
  failCount: items.filter((item) => item.status === "fail").length,
  warningCount: items.filter((item) => item.status === "warning").length,
}


  return (
    <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6 animate-fadeIn">
      <h2 className="text-xl font-semibold mb-6">Compliance Report</h2>

      <div className="flex justify-between mb-6">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span>Passed: {summary.passCount}</span>
        </div>
        <div className="flex items-center">
          <XCircle className="w-5 h-5 text-red-500 mr-2" />
          <span>Failed: {summary.failCount}</span>
        </div>
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
          <span>Warnings: {summary.warningCount}</span>
        </div>
      </div>

      <div className="space-y-4">
      {items.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-md border"
            style={{
              borderColor: item.status === "pass" ? "#10b981" : item.status === "fail" ? "#ef4444" : "#f59e0b",
              backgroundColor: item.status === "pass" ? "#ecfdf5" : item.status === "fail" ? "#fef2f2" : "#fffbeb",
            }}
          >
            <div className="flex items-start">
              {item.status === "pass" && <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />}
              {item.status === "fail" && <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />}
              {item.status === "warning" && <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />}

              <div>
                <h3 className="font-medium">{item.rule}</h3>
                <p className="text-sm mt-1">{item.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}