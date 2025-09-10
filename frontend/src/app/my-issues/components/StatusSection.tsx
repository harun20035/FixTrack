"use client"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import { useState } from "react"
import { styled } from "@mui/material/styles"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import IssueCard from "./IssueCard"
import type { Issue } from "../types"

const SectionHeader = styled(Box)(({ theme }) => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 12,
  padding: theme.spacing(2, 3),
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#42a5f5",
    backgroundColor: "#252525",
  },
}))

interface StatusSectionProps {
  status: string
  issues: Issue[]
  count: number
  onStatusChange: (issueId: number, newStatus: string) => void
  onDelete?: (issueId: number) => void
  onEditSuccess?: (updatedIssue: Issue) => void
}

export default function StatusSection({ status, issues, count, onStatusChange, onDelete, onEditSuccess }: StatusSectionProps) {
  const [expanded, setExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Primljeno":
        return "info"
      case "Dodijeljeno izvođaču":
        return "secondary"
      case "U toku":
        return "primary"
      case "Čeka dijelove":
        return "warning"
      case "Završeno":
        return "success"
      case "Otkazano":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Primljeno":
        return "📥"
      case "Dodijeljeno izvođaču":
        return "👤"
      case "U toku":
        return "🔧"
      case "Čeka dijelove":
        return "⏳"
      case "Završeno":
        return "✅"
      case "Otkazano":
        return "❌"
      default:
        return "📋"
    }
  }

  const handleToggle = () => {
    setExpanded(!expanded)
  }

  return (
    <Box>
      <SectionHeader onClick={handleToggle}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
              {getStatusIcon(status)}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              {status}
            </Typography>
            <Chip
              label={count}
              color={getStatusColor(status) as "primary" | "secondary" | "warning" | "error" | "info" | "success" | "default"}
              size="small"
              sx={{
                fontWeight: 600,
                minWidth: "32px",
              }}
            />
          </Box>
          <IconButton sx={{ color: "#42a5f5" }}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
        </Box>
      </SectionHeader>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {issues.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              <Typography variant="body1">Nema prijava sa statusom &quot;{status}&quot;</Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onStatusChange={onStatusChange} onDelete={onDelete} onEditSuccess={onEditSuccess} />
              ))}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}
