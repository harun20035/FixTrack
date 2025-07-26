"use client"

import type React from "react"

import { useState } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import CircularProgress from "@mui/material/CircularProgress"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import PersonIcon from "@mui/icons-material/Person"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import SyncIcon from "@mui/icons-material/Sync"
import type { Issue } from "../types"

interface IssueCardProps {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleChangeStatus = async () => {
    setIsChangingStatus(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsChangingStatus(false)
    // Here you would typically update the issue status
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
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
        return "#666"
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
        return "#666"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "u toku":
        return "#2196f3"
      case "završeno":
        return "#4caf50"
      case "na čekanju":
        return "#ffc107"
      case "otkazano":
        return "#f44336"
      default:
        return "#666"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "u toku":
        return "U TOKU"
      case "završeno":
        return "ZAVRŠENO"
      case "na čekanju":
        return "NA ČEKANJU"
      case "otkazano":
        return "OTKAZANO"
      default:
        return status.toUpperCase()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Card
      sx={{
        backgroundColor: "#2a2a2a",
        border: "1px solid #444",
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "#42a5f5",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(66, 165, 245, 0.15)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: 600,
                mb: 1,
                lineHeight: 1.3,
              }}
            >
              {issue.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#b0b0b0",
                mb: 2,
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {issue.description}
            </Typography>
          </Box>

          <IconButton onClick={handleMenuOpen} sx={{ color: "#b0b0b0" }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Badges */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          <Chip
            label={issue.priority.toUpperCase()}
            size="small"
            sx={{
              backgroundColor: getPriorityColor(issue.priority),
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
          <Chip
            label={issue.category.toUpperCase()}
            size="small"
            sx={{
              backgroundColor: getCategoryColor(issue.category),
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
          <Chip
            label={getStatusText(issue.status)}
            size="small"
            sx={{
              backgroundColor: getStatusColor(issue.status),
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Box>

        {/* Tenant Info */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <PersonIcon sx={{ color: "#42a5f5", fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: "#fff", fontWeight: 500 }}>
              {issue.tenant.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              • {issue.tenant.apartment}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <PhoneIcon sx={{ color: "#42a5f5", fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              {issue.tenant.phone}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <LocationOnIcon sx={{ color: "#42a5f5", fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              {issue.location}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CalendarTodayIcon sx={{ color: "#42a5f5", fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              Prijavljeno: {formatDate(issue.dateReported)}
            </Typography>
          </Box>

          {issue.contractor && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon sx={{ color: "#4caf50", fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: "#4caf50", fontWeight: 500 }}>
                Izvođač: {issue.contractor}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: "#444", mb: 3 }} />

        {/* Action Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={isChangingStatus ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <SyncIcon />}
          onClick={handleChangeStatus}
          disabled={isChangingStatus}
          sx={{
            background: "linear-gradient(45deg, #4caf50 30%, #388e3c 90%)",
            color: "#fff",
            fontWeight: 600,
            py: 1.5,
            "&:hover": {
              background: "linear-gradient(45deg, #388e3c 30%, #2e7d32 90%)",
            },
            "&:disabled": {
              background: "#666",
              color: "#999",
            },
          }}
        >
          {isChangingStatus ? "Mijenjanje statusa..." : "Promjeni Status"}
        </Button>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              "& .MuiMenuItem-root": {
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(66, 165, 245, 0.1)",
                },
              },
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>Prikaži detalje</MenuItem>
          <MenuItem onClick={handleMenuClose}>Dodaj napomenu</MenuItem>
          <MenuItem onClick={handleMenuClose}>Kontaktiraj stanara</MenuItem>
          <MenuItem onClick={handleMenuClose}>Pošalji obavještenje</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  )
}
