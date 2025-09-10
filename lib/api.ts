import axios from "axios"

const API_BASE_URL = "http://localhost:8080/api"

export const uploadPDF = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post(`${API_BASE_URL}/pdf/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error uploading PDF:", error)
    throw error
  }
}