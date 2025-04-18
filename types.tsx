export type ComplianceReportItem = {
    rule: string
    status: "pass" | "fail"
    message: string
  }
  
  export type ComplianceReportSummary = {
    passCount: number
    failCount: number
  }
  
  export type ComplianceReport = {
    items: ComplianceReportItem[]
    summary: ComplianceReportSummary
  }
  