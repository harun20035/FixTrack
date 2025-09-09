"use client"

import { useState } from "react"
import { Dialog, DialogContent, IconButton, Box, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

interface ImageViewerProps {
  open: boolean
  onClose: () => void
  images: string[]
  issueTitle: string
}

export default function ImageViewer({ open, onClose, images, issueTitle }: ImageViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleClose = () => {
    setCurrentImageIndex(0)
    onClose()
  }

  if (images.length === 0) return null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "rgba(0, 0, 0, 0.9)",
          border: "none",
          boxShadow: "none",
          maxWidth: "90vw",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogContent
        sx={{ p: 0, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {/* Close button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#fff",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Image counter */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "#fff",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            px: 2,
            py: 1,
            borderRadius: 1,
            zIndex: 1000,
          }}
        >
          <Typography variant="body2">
            {currentImageIndex + 1} / {images.length}
          </Typography>
        </Box>

        {/* Previous button */}
        {images.length > 1 && (
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: "absolute",
              left: 16,
              color: "#fff",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}

        {/* Next button */}
        {images.length > 1 && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              color: "#fff",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}

        {/* Image */}
        <Box
          component="img"
          src={`http://localhost:8000${images[currentImageIndex]}`}
          alt={`${issueTitle} - slika ${currentImageIndex + 1}`}
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />

        {/* Image title */}
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            px: 2,
            py: 1,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">{issueTitle}</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
