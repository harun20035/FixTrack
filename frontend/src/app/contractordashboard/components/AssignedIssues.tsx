"use client"

import type React from "react"

import Box from "@mui/material/Box"
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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import BuildIcon from "@mui/icons-material/Build"
import CancelIcon from "@mui/icons-material/Cancel"

const IssueCard = styled(Card)(({ theme }) => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  marginBottom: theme.spacing(2),
  "&:hover": {
    borderColor: "#42a5f5",
  },
}))

interface AssignedIssue {
  id: number
  title: string
  description: string
  location: string
  status: string
  category: string
  assignedAt: string
  estimatedCost?: number
  plannedDate?: string
  priority: string
}

export default function AssignedIssues() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null)

  // Mock data
  const assignedIssues: AssignedIssue[] = [
    {
      id: 1,
      title: "Kvar na slavini u kupatilu",
      description: "Slavina u kupatilu curi i ne može se zatvoriti potpuno",
      location: "Stan 15, kupatilo",
      status: "Primljeno",
      category: "Vodoinstalacije",
      assignedAt: "2025-01-25T10:30:00Z",
      priority: "Visok",
    },
    {
      id: 2,
      title: "Problem sa grijanjem",
      description: "Radijatori u dnevnoj sobi ne griju dovoljno",
      location: "Stan 22, dnevna soba",
      status: "Na lokaciji",
      category: "Grijanje",
      assignedAt: "2025-01-24T14:20:00Z",
      estimatedCost: 150,
      plannedDate: "2025-01-26",
      priority: "Srednji",
    },
    {
      id: 3,
      title: "Prekidač u hodniku ne radi",
      description: "Prekidač za svjetlo u hodniku drugog sprata ne funkcioniše",
      location: "Hodnik 2. sprat",
      status: "Popravka u toku",
      category: "Elektroinstalacije",
      assignedAt: "2025-01-23T16:45:00Z",
      estimatedCost: 80,
      plannedDate: "2025-01-25",
      priority: "Nizak",
    },
  ]

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, issueId: number) => {
    setAnchorEl(event.currentTarget)
    setSelectedIssue(issueId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedIssue(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Primljeno":
        return "info"
      case "Na lokaciji":
        return "warning"
      case "Popravka u toku":
        return "primary"
      case "Čeka dijelove":
        return "secondary"
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
    })
  }

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Dodijeljene Prijave ({assignedIssues.length})
      </Typography>
      {assignedIssues.map((issue) => (
        <IssueCard key={issue.id}>
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                  {issue.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Chip
                    label={issue.status}
                    color={getStatusColor(issue.status) as any}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={issue.priority}
                    size="small"
                    sx={{
                      backgroundColor: getPriorityColor(issue.priority),
                      color: "white",
                    }}
                  />
                  <Chip label={issue.category} size="small" variant="outlined" sx={{ borderColor: "#42a5f5" }} />
                </Box>
              </Box>
              <IconButton onClick={(e) => handleMenuOpen(e, issue.id)} sx={{ color: "text.secondary" }}>
                <MoreVertIcon />
              </IconButton>
            </Box>

            {/* Description */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
              {issue.description}
            </Typography>

            {/* Details */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                <Typography variant="body2" color="text.secondary">
                  {issue.location}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                <Typography variant="body2" color="text.secondary">
                  Dodijeljeno: {formatDate(issue.assignedAt)}
                </Typography>
              </Box>
              {issue.estimatedCost && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AttachMoneyIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                  <Typography variant="body2" color="text.secondary">
                    Procjena: {issue.estimatedCost} KM
                  </Typography>
                </Box>
              )}
              {issue.plannedDate && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                  <Typography variant="body2" color="text.secondary">
                    Planirani datum: {formatDate(issue.plannedDate)}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Quick Actions */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {issue.status === "Primljeno" && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<LocationOnIcon />}
                  sx={{
                    background: "linear-gradient(45deg, #ff9800 30%, #f57c00 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #f57c00 30%, #ff9800 90%)",
                    },
                  }}
                >
                  Na Lokaciji
                </Button>
              )}
              {issue.status === "Na lokaciji" && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<BuildIcon />}
                  sx={{
                    background: "linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    },
                  }}
                >
                  Počni Popravku
                </Button>
              )}
              {(issue.status === "Popravka u toku" || issue.status === "Čeka dijelove") && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  sx={{
                    background: "linear-gradient(45deg, #4caf50 30%, #388e3c 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #388e3c 30%, #4caf50 90%)",
                    },
                  }}
                >
                  Završi
                </Button>
              )}
            </Box>
          </CardContent>
        </IssueCard>
      ))}

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <BuildIcon sx={{ mr: 1 }} />
          Dodaj Bilješku
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <AttachMoneyIcon sx={{ mr: 1 }} />
          Ažuriraj Procjenu
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <CalendarTodayIcon sx={{ mr: 1 }} />
          Promijeni Datum
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "#f44336" }}>
          <CancelIcon sx={{ mr: 1 }} />
          Odbij Zadatak
        </MenuItem>
      </Menu>
    </Box>
  )
}
