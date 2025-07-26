"use client"
import Box from "@mui/material/Box"
import type React from "react"

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
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { useState } from "react"
import type { Issue } from "../types"

interface IssueCardProps {
  issue: Issue
  onAssignContractor: (issueId: string) => void
  isAssigning: boolean
}

export default function IssueCard({ issue, onAssignContractor, isAssigning }: IssueCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

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
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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
                label="PRIMLJENO"
                size="small"
                sx={{
                  backgroundColor: "#666",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
            </Box>
          </Box>
          <IconButton onClick={handleMenuOpen} sx={{ color: "#b0b0b0" }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "#b0b0b0",
            mb: 3,
            lineHeight: 1.5,
          }}
        >
          {issue.description}
        </Typography>

        {/* Details */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PersonIcon sx={{ color: "#42a5f5", fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ color: "#fff", fontWeight: 500 }}>
              {issue.tenant.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#b0b0b0", ml: 1 }}>
              - {issue.tenant.apartment}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PhoneIcon sx={{ color: "#42a5f5", fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              {issue.tenant.phone}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOnIcon sx={{ color: "#42a5f5", fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              {issue.location}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarTodayIcon sx={{ color: "#42a5f5", fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              {formatDate(issue.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#444", mb: 3 }} />

        {/* Action Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={isAssigning ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <AssignmentIndIcon />}
          onClick={() => onAssignContractor(issue.id)}
          disabled={isAssigning}
          sx={{
            background: "linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)",
            color: "#fff",
            fontWeight: 600,
            py: 1.5,
            "&:hover": {
              background: "linear-gradient(45deg, #1976d2 30%, #1565c0 90%)",
            },
            "&:disabled": {
              background: "#666",
              color: "#999",
            },
          }}
        >
          {isAssigning ? "Dodjeljivanje..." : "Dodijeli Izvođača"}
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
          <Divider sx={{ borderColor: "#444" }} />
          <MenuItem onClick={handleMenuClose} sx={{ color: "#f44336 !important" }}>
            Odbaci prijavu
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  )
}
