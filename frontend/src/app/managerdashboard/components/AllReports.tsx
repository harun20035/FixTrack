"use client"
import Box from "@mui/material/Box"
import type React from "react"

import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { useState } from "react"
import { styled } from "@mui/material/styles"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import PersonIcon from "@mui/icons-material/Person"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import CommentIcon from "@mui/icons-material/Comment"

const ReportCard = styled(Card)(({ theme }) => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  marginBottom: theme.spacing(2),
  "&:hover": {
    borderColor: "#42a5f5",
  },
}))

interface Report {
  id: number
  title: string
  description: string
  location: string
  status: string
  category: string
  tenant: string
  assignedTo?: string
  createdAt: string
  priority: string
}

export default function AllReports() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedReport, setSelectedReport] = useState<number | null>(null)

  // Mock data
  const allReports: Report[] = [
    {
      id: 1,
      title: "Kvar na slavini u kupatilu",
      description: "Slavina u kupatilu curi i ne može se zatvoriti potpuno",
      location: "Stan 15, kupatilo",
      status: "Primljeno",
      category: "Vodoinstalacije",
      tenant: "Ana Marić",
      createdAt: "2025-01-25T10:30:00Z",
      priority: "Visok",
    },
    {
      id: 2,
      title: "Problem sa grijanjem",
      description: "Radijatori u dnevnoj sobi ne griju dovoljno",
      location: "Stan 22, dnevna soba",
      status: "Dodijeljeno",
      category: "Grijanje",
      tenant: "Petar Jovanović",
      assignedTo: "Marko Petrović",
      createdAt: "2025-01-24T14:20:00Z",
      priority: "Srednji",
    },
    {
      id: 3,
      title: "Prekidač u hodniku ne radi",
      description: "Prekidač za svjetlo u hodniku drugog sprata ne funkcioniše",
      location: "Hodnik 2. sprat",
      status: "U toku",
      category: "Elektroinstalacije",
      tenant: "Milica Stojanović",
      assignedTo: "Stefan Nikolić",
      createdAt: "2025-01-23T16:45:00Z",
      priority: "Nizak",
    },
    {
      id: 4,
      title: "Curenje u podrumu",
      description: "Voda curi iz cijevi u podrumu zgrade",
      location: "Podrum",
      status: "Čeka dijelove",
      category: "Vodoinstalacije",
      tenant: "Marija Pavlović",
      assignedTo: "Ana Jovanović",
      createdAt: "2025-01-22T09:15:00Z",
      priority: "Visok",
    },
  ]

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, reportId: number) => {
    setAnchorEl(event.currentTarget)
    setSelectedReport(reportId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedReport(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Primljeno":
        return "info"
      case "Dodijeljeno":
        return "secondary"
      case "U toku":
        return "primary"
      case "Čeka dijelove":
        return "warning"
      case "Završeno":
        return "success"
      default:
        return "default"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Visok":
        return "#f44336"
      case "Srednji":
        return "#ff9800"
      case "Nizak":
        return "#4caf50"
      default:
        return "#42a5f5"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Sve Prijave ({allReports.length})
      </Typography>
      {allReports.map((report) => (
        <ReportCard key={report.id}>
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                  {report.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Chip
                    label={report.status}
                    color={getStatusColor(report.status) as any}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={report.priority}
                    size="small"
                    sx={{
                      backgroundColor: getPriorityColor(report.priority),
                      color: "white",
                    }}
                  />
                  <Chip label={report.category} size="small" variant="outlined" sx={{ borderColor: "#42a5f5" }} />
                </Box>
              </Box>
              <IconButton onClick={(e) => handleMenuOpen(e, report.id)} sx={{ color: "text.secondary" }}>
                <MoreVertIcon />
              </IconButton>
            </Box>

            {/* Description */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
              {report.description}
            </Typography>

            {/* Details */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                <Typography variant="body2" color="text.secondary">
                  {report.location}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                <Typography variant="body2" color="text.secondary">
                  Stanar: {report.tenant}
                </Typography>
              </Box>
              {report.assignedTo && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AssignmentIndIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                  <Typography variant="body2" color="text.secondary">
                    Izvođač: {report.assignedTo}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                <Typography variant="body2" color="text.secondary">
                  Prijavljeno: {formatDate(report.createdAt)}
                </Typography>
              </Box>
            </Box>

            {/* Quick Actions */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {report.status === "Primljeno" && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AssignmentIndIcon />}
                  sx={{
                    background: "linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    },
                  }}
                >
                  Dodijeli Izvođača
                </Button>
              )}
              <Button
                size="small"
                variant="outlined"
                startIcon={<CommentIcon />}
                sx={{
                  borderColor: "#42a5f5",
                  color: "#42a5f5",
                  "&:hover": {
                    borderColor: "#1976d2",
                    backgroundColor: "rgba(66, 165, 245, 0.1)",
                  },
                }}
              >
                Dodaj Napomenu
              </Button>
            </Box>
          </CardContent>
        </ReportCard>
      ))}

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <AssignmentIndIcon sx={{ mr: 1 }} />
          Dodijeli Izvođača
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <CommentIcon sx={{ mr: 1 }} />
          Dodaj Napomenu
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PersonIcon sx={{ mr: 1 }} />
          Kontaktiraj Stanara
        </MenuItem>
      </Menu>
    </Box>
  )
}
