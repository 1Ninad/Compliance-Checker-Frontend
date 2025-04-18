export interface ComplianceItem {
    rule: string
    status: "pass" | "fail" | "warning"
    message: string
  }
  
  export interface ComplianceReport {

    id: number;
  fileName: string;
  abstractPresent: boolean;
  fontCompliant: boolean;
  columnFormatCompliant: boolean;
  keywordsPresent: boolean;
  authorDetailsCompliant: boolean;
  introNumberingValid: boolean;
  createdAt: string;



    items: ComplianceItem[]
    summary?: {
      passCount: number
      failCount: number
      warningCount: number
    }
  }
  
  