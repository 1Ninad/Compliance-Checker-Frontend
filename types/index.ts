export interface ComplianceItem {
    rule: string
    status: "pass" | "fail" | "warning"
    message: string
  }
  
  export interface ComplianceReport {
    items: ComplianceItem[]
    summary?: {
      passCount: number
      failCount: number
      warningCount: number
    }
  }
  
  