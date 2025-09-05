"use client"

import type React from "react"

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import { styled } from "@mui/material/styles"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import { ContractorIssue } from "../../../utils/dashboardApi"

const IssueCard = styled(Card)(({ theme }) => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  marginBottom: theme.spacing(2),
  "&:hover": {
    borderColor: "#42a5f5",
  },
}))

interface AssignedIssuesProps {
  assignedIssues: ContractorIssue[]
}

export default function AssignedIssues({ assignedIssues }: AssignedIssuesProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
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
                  Dodijeljeno: {formatDate(issue.assigned_at)}
                </Typography>
              </Box>
              {issue.estimated_cost && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AttachMoneyIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                  <Typography variant="body2" color="text.secondary">
                    Procjena: {issue.estimated_cost} KM
                  </Typography>
                </Box>
              )}
              {issue.planned_date && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                  <Typography variant="body2" color="text.secondary">
                    Planirani datum: {formatDate(issue.planned_date)}
                  </Typography>
                </Box>
              )}
            </Box>

          </CardContent>
        </IssueCard>
      ))}

    </Box>
  )
}
