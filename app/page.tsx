"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, FileText } from "lucide-react"
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ComplianceReport as ComplianceReportComponent } from "@/components/compliance-report"
import type { ComplianceReport as ComplianceReportType } from "@/types"

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`

export default function IEEEComplianceChecker() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [report, setReport] = useState<ComplianceReportType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
        setError(null)
      } else {
        setError("Please upload a PDF file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (selected.type === "application/pdf") {
        setFile(selected)
        setError(null)
      } else {
        setError("Please upload a PDF file")
      }
    }
  }

  const analyzeFile = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setProgress(0)
    setError(null)

    // progress simulation
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const url = `${API_BASE_URL}/pdf/upload`
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const contentType = response.headers.get("content-type") || ""
      if (!contentType.includes("application/json")) {
        const textResponse = await response.text()
        throw new Error(
          `Server returned non-JSON response. Please check if the API is running. Preview: ${textResponse.slice(0, 200)}`
        )
      }

      const reportData: ComplianceReportType = await response.json()

      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      setProgress(100)
      setReport(reportData)

      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisComplete(true)
      }, 500)
    } catch (err) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      setIsAnalyzing(false)
      setProgress(0)
      setReport(null)
      setAnalysisComplete(false)
      setError(err instanceof Error ? err.message : "Unexpected error during analysis")
    }
  }

  const resetAnalysis = () => {
    setFile(null)
    setAnalysisComplete(false)
    setIsAnalyzing(false)
    setProgress(0)
    setReport(null)
    setError(null)
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
  }

  return (
  <div className="min-h-screen bg-background">
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-foreground">
                IEEE PDF Compliance Checker
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                Analyze IEEE formatting requirements
              </p>
            </div>
          </div>

          <a
          href="https://github.com/1Ninad/Compliance-Checker-Backend"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub repository"
          className="absolute top-6 right-6 z-50 text-black"
          >
          <FaGithub className="w-8 h-8" />
          </a>

          
        </div>
      </div>
    </header>

    <main className="container mx-auto px-4 py-8">
      {!analysisComplete ? (
        <div className="mx-auto max-w-2xl space-y-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Upload Your IEEE Paper</CardTitle>
              <CardDescription>
                Upload Research paper PDF to analyze its compliance with IEEE formatting requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : file
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />

                {file ? (
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/10 mx-auto">
                      <FileText className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Drop your PDF here</p>
                      <p className="text-sm text-muted-foreground">or click to browse files</p>
                    </div>
                  </div>
                )}
              </div>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing compliance...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {error}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Please ensure your backend API is running and accessible.
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <Button onClick={analyzeFile} disabled={!file || isAnalyzing} className="w-full sm:w-auto" size="lg">
                  {isAnalyzing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Analyzing...
                    </>
                  ) : (
                    "Check Compliance"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/10">
                    <FileText className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <p className="font-medium">Format Validation</p>
                    <p className="text-sm text-muted-foreground">Check margins, fonts, spacing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/10">
                    <FileText className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <p className="font-medium">Structure Check</p>
                    <p className="text-sm text-muted-foreground">Validate document sections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <ComplianceReportComponent report={report} fileName={file?.name || ""} onReset={resetAnalysis} />
      )}
    </main>
  </div>
);
}
