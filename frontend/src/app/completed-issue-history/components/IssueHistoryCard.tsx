"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, Typography, Box, Chip, Button, IconButton, Menu, MenuItem } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import NotesIcon from "@mui/icons-material/Notes"
import ImageIcon from "@mui/icons-material/Image"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import type { CompletedIssue } from "../types"
import NotesModal from "./NotesModal"
import ImageViewer from "./ImageViewer"

interface IssueHistoryCardProps {
  issue: CompletedIssue
}

export default function IssueHistoryCard({ issue }: IssueHistoryCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notesModalOpen, setNotesModalOpen] = useState(false)
  const [imageViewerOpen, setImageViewerOpen] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleViewPdf = () => {
    if (issue.warranty_pdf) {
      window.open(`http://localhost:8000${issue.warranty_pdf}`, "_blank")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "visok":
        return "#f44336"
      case "srednji":
        return "#ff9800"
      case "nizak":
        return "#4caf50"
      default:
        return "#757575"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "voda":
        return "#2196f3"
      case "struja":
        return "#ff9800"
      case "grijanje":
        return "#f44336"
      case "ostalo":
        return "#9c27b0"
      default:
        return "#757575"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "voda":
        return "Voda"
      case "struja":
        return "Struja"
      case "grijanje":
        return "Grijanje"
      case "ostalo":
        return "Ostalo"
      default:
        return category
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Card
        sx={{
          bgcolor: "#2a2a2a",
          border: "1px solid #333",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(66, 165, 245, 0.15)",
            borderColor: "#42a5f5",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header sa title i menu */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, flex: 1 }}>
              {issue.title}
            </Typography>
            <IconButton onClick={handleMenuOpen} sx={{ color: "#b0b0b0", ml: 1 }}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Chips */}
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Chip
              label={issue.priority.toUpperCase()}
              size="small"
              sx={{
                bgcolor: getPriorityColor(issue.priority),
                color: "#fff",
                fontWeight: 600,
              }}
            />
            <Chip
              label={getCategoryLabel(issue.category)}
              size="small"
              sx={{
                bgcolor: getCategoryColor(issue.category),
                color: "#fff",
                fontWeight: 600,
              }}
            />
            <Chip
              label="ZAVRŠENO"
              size="small"
              sx={{
                bgcolor: "#4caf50",
                color: "#fff",
                fontWeight: 600,
              }}
            />
          </Box>

          {/* Description */}
          <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 2 }}>
            {issue.description}
          </Typography>

          {/* Tenant info */}
          <Box sx={{ mb: 2 }}>
            {issue.tenant && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <PersonIcon sx={{ color: "#42a5f5", fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    {issue.tenant.name} - {issue.tenant.apartment}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <PhoneIcon sx={{ color: "#42a5f5", fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                    {issue.tenant.phone}
                  </Typography>
                </Box>
              </>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <LocationOnIcon sx={{ color: "#42a5f5", fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                {issue.location}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon sx={{ color: "#42a5f5", fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                Završeno: {formatDate(issue.completed_at)}
              </Typography>
            </Box>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<NotesIcon />}
              onClick={() => setNotesModalOpen(true)}
              sx={{
                bgcolor: "#42a5f5",
                "&:hover": { bgcolor: "#1976d2" },
                textTransform: "none",
              }}
            >
              Bilješke ({issue.notes.length})
            </Button>

            {issue.images.length > 0 && (
              <Button
                variant="contained"
                startIcon={<ImageIcon />}
                onClick={() => setImageViewerOpen(true)}
                sx={{
                  bgcolor: "#4caf50",
                  "&:hover": { bgcolor: "#388e3c" },
                  textTransform: "none",
                }}
              >
                Slike ({issue.images.length})
              </Button>
            )}

            {issue.warranty_pdf && (
              <Button
                variant="contained"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleViewPdf}
                sx={{
                  bgcolor: "#f44336",
                  "&:hover": { bgcolor: "#d32f2f" },
                  textTransform: "none",
                }}
              >
                Garancija
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: "#2a2a2a",
            border: "1px solid #333",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setNotesModalOpen(true)
            handleMenuClose()
          }}
          sx={{ color: "#fff" }}
        >
          <NotesIcon sx={{ mr: 1 }} />
          Prikaži bilješke
        </MenuItem>
        {issue.images.length > 0 && (
          <MenuItem
            onClick={() => {
              setImageViewerOpen(true)
              handleMenuClose()
            }}
            sx={{ color: "#fff" }}
          >
            <ImageIcon sx={{ mr: 1 }} />
            Prikaži slike
          </MenuItem>
        )}
        {issue.warranty_pdf && (
          <MenuItem
            onClick={() => {
              handleViewPdf()
              handleMenuClose()
            }}
            sx={{ color: "#fff" }}
          >
            <PictureAsPdfIcon sx={{ mr: 1 }} />
            Otvori garanciju
          </MenuItem>
        )}
      </Menu>

      {/* Modals */}
      <NotesModal
        open={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        notes={issue.notes}
        issueTitle={issue.title}
      />

      <ImageViewer
        open={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        images={issue.images}
        issueTitle={issue.title}
      />
    </>
  )
}
