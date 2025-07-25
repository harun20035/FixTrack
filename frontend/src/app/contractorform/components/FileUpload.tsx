"use client"
import { useRef, useState } from "react"
import type React from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Alert from "@mui/material/Alert"
import { styled } from "@mui/material/styles"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DeleteIcon from "@mui/icons-material/Delete"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import DescriptionIcon from "@mui/icons-material/Description"

const UploadArea = styled(Box)(({ theme }) => ({
  border: "2px dashed #333",
  borderRadius: 12,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor: "#2a2a2a",
  "&:hover": {
    borderColor: "#42a5f5",
    backgroundColor: "rgba(66, 165, 245, 0.05)",
  },
  "&.dragover": {
    borderColor: "#42a5f5",
    backgroundColor: "rgba(66, 165, 245, 0.1)",
  },
}))

const FileCard = styled(Card)(({ theme }) => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  borderRadius: 8,
  overflow: "hidden",
}))

interface FileUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
  error?: string
}

export default function FileUpload({ file, onFileChange, error }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const maxFileSize = 10 * 1024 * 1024 // 10MB
  const allowedType = "application/pdf"

  const validateFile = (file: File): string | null => {
    if (file.type !== allowedType) {
      return "Dozvoljen je samo PDF format"
    }
    if (file.size > maxFileSize) {
      return "Fajl ne može biti veći od 10MB"
    }
    return null
  }

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return

    const validationError = validateFile(selectedFile)
    if (validationError) {
      // You might want to show this error in a toast or alert
      console.error(validationError)
      return
    }

    onFileChange(selectedFile)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    const droppedFile = event.dataTransfer.files[0]
    handleFileSelect(droppedFile)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null
    handleFileSelect(selectedFile)
    // Reset input value so same file can be selected again
    event.target.value = ""
  }

  const removeFile = () => {
    onFileChange(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2, backgroundColor: "rgba(244, 67, 54, 0.1)" }}>
          {error}
        </Alert>
      )}

      {!file ? (
        <>
          {/* Upload Area */}
          <UploadArea
            className={dragOver ? "dragover" : ""}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: "#42a5f5", mb: 2 }} />
            <Typography variant="h6" color="primary" gutterBottom>
              Prevucite PDF fajl ovdje ili kliknite za odabir
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Samo PDF format • Maksimalno 10MB
            </Typography>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#42a5f5",
                color: "#42a5f5",
                "&:hover": {
                  borderColor: "#1976d2",
                  backgroundColor: "rgba(66, 165, 245, 0.1)",
                },
              }}
            >
              Odaberi PDF Fajl
            </Button>
          </UploadArea>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />
        </>
      ) : (
        /* File Preview */
        <FileCard>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PictureAsPdfIcon sx={{ fontSize: 40, color: "#f44336" }} />
                <Box>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(file.size)} • PDF dokument
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={removeFile}
                sx={{
                  color: "#f44336",
                  "&:hover": {
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </FileCard>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, fontStyle: "italic" }}>
        <DescriptionIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
        Preporučujemo da uključite informacije o vašem iskustvu, certifikatima i prethodnim projektima.
      </Typography>
    </Box>
  )
}
