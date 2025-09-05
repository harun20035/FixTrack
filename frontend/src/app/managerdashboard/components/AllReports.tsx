"use client"
import Box from "@mui/material/Box"
import type React from "react"

import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import { styled } from "@mui/material/styles"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import PersonIcon from "@mui/icons-material/Person"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import { ManagerIssue } from "../../../utils/dashboardApi"

const ReportCard = styled(Card)(({ theme }) => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  marginBottom: theme.spacing(2),
  "&:hover": {
    borderColor: "#42a5f5",
  },
}))

interface AllReportsProps {
  recentIssues: ManagerIssue[]
}

export default function AllReports({ recentIssues }: AllReportsProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Nedavne Prijave ({recentIssues.length})
      </Typography>
      {recentIssues.map((report) => (
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
              {report.assigned_to && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AssignmentIndIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                  <Typography variant="body2" color="text.secondary">
                    Izvođač: {report.assigned_to}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                <Typography variant="body2" color="text.secondary">
                  Prijavljeno: {formatDate(report.created_at)}
                </Typography>
              </Box>
            </Box>

          </CardContent>
        </ReportCard>
      ))}

    </Box>
  )
}
