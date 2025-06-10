"use client"
import { useState } from "react"
import type React from "react"
import { Upload, FileText, Loader2, AlertCircle} from "lucide-react"

import { FaGithub } from "react-icons/fa";

import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import ComplianceReport from "@/components/compliance-report"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { ComplianceReport as ComplianceReportType } from "@/types"

const API_BASE_URL = "https://compliancecheckerbackend-production.up.railway.app/api"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [report, setReport] = useState<ComplianceReportType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
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
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Please upload a PDF file")
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setIsUploading(true)
    setError(null)
    setProgress(0)

    // Start progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        return newProgress >= 95 ? 95 : newProgress 
      })
    }, 300)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post(`${API_BASE_URL}/pdf/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        setProgress(100)
        setTimeout(() => {
          setReport(response.data)
        }, 500)
      } else {
        setError("Unexpected server response.")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error occurred during upload"    
      setError(errorMessage)
    } finally {
      clearInterval(progressInterval)
      setIsUploading(false)
    }
  }

  const resetAll = () => {
    setFile(null)
    setIsUploading(false)
    setReport(null)
    setProgress(0)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-100 p-4 md:p-8">
      <header className="max-w-5xl mx-auto mb-12">
      <div className="flex items-center gap-3">
  <h1 className="text-3xl md:text-4xl font-bold text-emerald-400 md:text-transparent md:bg-clip-text md:bg-gradient-to-r md:from-emerald-400 md:to-teal-500">
    IEEE Compliance Checker
  </h1>
</div>


        <a
  href="https://github.com/1Ninad/Compliance-Checker-Backend"
  target="_blank"
  rel="noopener noreferrer"
  className="absolute top-6 right-6 z-50 text-zinc-300 hover:text-emerald-400 transition-colors duration-200"
>
  <FaGithub className="w-8 h-8" />
</a>


        <p className="mt-3 text-zinc-400 max-w-2xl">
          Upload IEEE research paper PDF to analyze its compliance with IEEE formatting requirements
        </p>
      </header>

      <main className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!file && !report ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div
                className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-emerald-400 bg-emerald-400/10"
                    : "border-zinc-700 hover:border-zinc-500 bg-zinc-800/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-700/50 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold">Drop your IEEE paper here</h2>
                  
                  <label htmlFor="file-upload">
                    <div className="mt-4 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-zinc-900 font-medium rounded-lg cursor-pointer transition-colors duration-200">
                      Click to browse PDF File
                    </div>
                    <input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                  </label>

                  {error && (
                    <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" /> {error}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-zinc-800/80 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-zinc-700">
                {file && !report && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">

                      <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg truncate">{file.name}</h3>
                        <p className="text-zinc-400 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      {!isUploading && (
                        <Button
                          onClick={handleUpload}
                          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-zinc-900"
                          disabled={isUploading}
                        >
                          Check Compliance
                        </Button>
                      )}
                    </div>

                    {isUploading && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-400">Analyzing document...</span>
                          <span className="text-sm font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-zinc-700">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </Progress>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {progress < 30
                            ? "Scanning document structure..."
                            : progress < 60
                              ? "Checking IEEE formatting rules..."
                              : progress < 90
                                ? "Validating against IEEE standards..."
                                : "Finalizing report..."}
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Error</p>
                          <p className="text-sm">{error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {report && <ComplianceReport report={report} onReset={resetAll} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-5xl mx-auto mt-12 text-center text-zinc-500 text-sm">
        <p>IEEE Compliance Checker</p>
      </footer>
    </div>
  )
}
