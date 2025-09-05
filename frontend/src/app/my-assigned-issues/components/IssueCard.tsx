"use client"

import type React from "react"

import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import type { Issue } from "../types"

interface IssueCardProps {
  issue: Issue
}

export default function IssueCard({ issue }: IssueCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isChangingStatus, setIsChangingStatus] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleChangeStatus = async () => {
    setIsChangingStatus(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsChangingStatus(false)
    console.log("Status promijenjen za issue:", issue.id)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "visok":
        return "#ef4444"
      case "srednji":
        return "#f97316"
      case "nizak":
        return "#22c55e"
      default:
        return "#666"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "voda":
        return "#3b82f6"
      case "struja":
        return "#f97316"
      case "grijanje":
        return "#ef4444"
      case "ostalo":
        return "#8b5cf6"
      default:
        return "#666"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "dodijeljeno":
        return "#8b5cf6"
      case "u toku":
        return "#3b82f6"
      case "čeka dijelove":
        return "#eab308"
      case "završeno":
        return "#22c55e"
      default:
        return "#666"
    }
  }

  const canChangeStatus = issue.status !== "završeno"

  return (
    <Card
      sx={{
        bgcolor: "#2a2a2a",
        border: "1px solid #333",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "#42a5f5",
          boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
        },
      }}
    >
      <CardContent>
        {/* Header with chips and menu */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={issue.priority.toUpperCase()}
              size="small"
              sx={{
                bgcolor: getPriorityColor(issue.priority),
                color: "#fff",
                fontWeight: "bold",
              }}
            />
            <Chip
              label={issue.category.toUpperCase()}
              size="small"
              sx={{
                bgcolor: getCategoryColor(issue.category),
                color: "#fff",
                fontWeight: "bold",
              }}
            />
            <Chip
              label={issue.status.toUpperCase()}
              size="small"
              sx={{
                bgcolor: getStatusColor(issue.status),
                color: "#fff",
                fontWeight: "bold",
              }}
            />
          </Box>

          <IconButton size="small" onClick={handleMenuOpen} sx={{ color: "#b0b0b0" }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Title and description */}
        <Typography variant="h6" sx={{ color: "#fff", mb: 1, fontWeight: "bold" }}>
          {issue.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 2 }}>
          {issue.description}
        </Typography>

        {/* Tenant info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <PersonIcon sx={{ color: "#666", fontSize: 16 }} />
          <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
            {issue.tenant.name} - {issue.tenant.apartment}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <PhoneIcon sx={{ color: "#666", fontSize: 16 }} />
          <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
            {issue.tenant.phone}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LocationOnIcon sx={{ color: "#666", fontSize: 16 }} />
          <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
            {issue.location}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <CalendarTodayIcon sx={{ color: "#666", fontSize: 16 }} />
          <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
            Prijavljeno: {new Date(issue.dateReported).toLocaleDateString("bs-BA")}
          </Typography>
        </Box>

        {/* Change Status Button */}
        {canChangeStatus && (
          <Button
            fullWidth
            variant="contained"
            onClick={handleChangeStatus}
            disabled={isChangingStatus}
            sx={{
              background: "linear-gradient(45deg, #22c55e, #16a34a)",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(45deg, #16a34a, #15803d)",
              },
              "&:disabled": {
                background: "#666",
                color: "#999",
              },
            }}
          >
            {isChangingStatus ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: "#fff" }} />
                Mijenjanje statusa...
              </>
            ) : (
              "Promjeni Status"
            )}
          </Button>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              bgcolor: "#2a2a2a",
              border: "1px solid #333",
              "& .MuiMenuItem-root": {
                color: "#fff",
                "&:hover": { bgcolor: "#333" },
              },
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>Prikaži detalje</MenuItem>
          <MenuItem onClick={handleMenuClose}>Dodaj napomenu</MenuItem>
          <MenuItem onClick={handleMenuClose}>Kontaktiraj stanara</MenuItem>
          <MenuItem onClick={handleMenuClose}>Priloži sliku</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  )
}
