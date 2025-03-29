"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Github } from "lucide-react"
import axios from "axios"
import ComplianceReport from "@/components/compliance-report"
import { Button } from "@/components/ui/button"
import type { ComplianceReport as ComplianceReportType } from "@/types"

const API_BASE_URL = "https://compliance-checker-backend-2w57.onrender.com/api"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [report, setReport] = useState<ComplianceReportType | null>(null)
  const [error, setError] = useState<string | null>(null)

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

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post(`${API_BASE_URL}/pdf/upload`, formData, {

        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        setReport(response.data)
      } else {
        setError("Unexpected server response.")
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during upload"
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold">Document Compliance Checker</h1>
        <a
          href="https://github.com/1Ninad/Compliance_Checker_Frontend"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
        >
          <Github className="w-6 h-6" />
        </a>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center transition-colors ${
          isDragging ? "border-gray-400 bg-gray-50" : "border-gray-200"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg mb-2">Drag and drop your PDF here</p>
        <p className="text-sm text-gray-500 mb-4">or click to browse files</p>

        <label htmlFor="file-upload">
          <div className="bg-black text-white px-4 py-2 rounded-md cursor-pointer">Select PDF</div>
          <input id="file-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
        </label>

        {file && (
          <p className="mt-4 text-sm">
            Selected file: <span className="font-medium">{file.name}</span>
          </p>
        )}

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>

      <Button
        className="w-full mt-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
        onClick={handleUpload}
        disabled={!file || isUploading}
      >
        {isUploading ? "Processing..." : "Check Compliance"}
      </Button>

      {report && <ComplianceReport report={report} />}
    </main>
  )
}