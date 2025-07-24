"use client"
import { useRef, useState } from "react"
import type React from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import CardActions from "@mui/material/CardActions"
import Alert from "@mui/material/Alert"
import { styled } from "@mui/material/styles"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DeleteIcon from "@mui/icons-material/Delete"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"

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

const ImageCard = styled(Card)(() => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  borderRadius: 8,
  overflow: "hidden",
}))

interface ImageUploadProps {
  images: File[]
  onImagesChange: (images: File[]) => void
}

export default function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState("")

  const maxFiles = 5
  const maxFileSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "Dozvoljena su samo JPEG, PNG i WebP format slika"
    }
    if (file.size > maxFileSize) {
      return "Slika ne može biti veća od 5MB"
    }
    return null
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    setError("")
    const newFiles: File[] = []
    const errors: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const validationError = validateFile(file)

      if (validationError) {
        errors.push(`${file.name}: ${validationError}`)
      } else if (images.length + newFiles.length < maxFiles) {
        newFiles.push(file)
      } else {
        errors.push(`Možete dodati maksimalno ${maxFiles} slika`)
        break
      }
    }

    if (errors.length > 0) {
      setError(errors.join(", "))
    }

    if (newFiles.length > 0) {
      onImagesChange([...images, ...newFiles])
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    handleFileSelect(event.dataTransfer.files)
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
    handleFileSelect(event.target.files)
    // Reset input value so same file can be selected again
    event.target.value = ""
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const getImageUrl = (file: File): string => {
    return URL.createObjectURL(file)
  }

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        <PhotoCameraIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Slike Kvara (Opciono)
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Dodajte slike koje prikazuju problem. Maksimalno {maxFiles} slika, do 5MB po slici.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, backgroundColor: "rgba(244, 67, 54, 0.1)" }}>
          {error}
        </Alert>
      )}

      {/* Upload Area */}
      <UploadArea
        className={dragOver ? "dragover" : ""}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        sx={{ mb: 3 }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: "#42a5f5", mb: 2 }} />
        <Typography variant="h6" color="primary" gutterBottom>
          Prevucite slike ovdje ili kliknite za odabir
        </Typography>
        <Typography variant="body2" color="text.secondary">
          JPEG, PNG, WebP • Maksimalno 5MB po slici
        </Typography>
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            borderColor: "#42a5f5",
            color: "#42a5f5",
            "&:hover": {
              borderColor: "#1976d2",
              backgroundColor: "rgba(66, 165, 245, 0.1)",
            },
          }}
        >
          Odaberi Slike
        </Button>
      </UploadArea>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.join(",")}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <Box>
          <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
            Odabrane Slike ({images.length}/{maxFiles})
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 2,
            }}
          >
            {images.map((image, index) => (
              <ImageCard key={index}>
                <CardMedia
                  component="img"
                  height="120"
                  image={getImageUrl(image)}
                  alt={`Slika ${index + 1}`}
                  sx={{ objectFit: "cover" }}
                />
                <CardActions sx={{ justifyContent: "space-between", p: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                    {image.name.length > 15 ? `${image.name.substring(0, 15)}...` : image.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeImage(index)}
                    sx={{
                      color: "#f44336",
                      "&:hover": {
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </ImageCard>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
