"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useRouter } from "next/navigation"
import { IssueFilters } from "./IssueFilters"
import { CategorizedIssuesList } from "./CategorizedIssuesList"
import type { FilterState } from "../types"

export function OtherIssuesLayout() {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFrom: "",
    dateTo: "",
    category: "",
    priority: "",
    status: "",
  })

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      dateFrom: "",
      dateTo: "",
      category: "",
      priority: "",
      status: "",
    })
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#121212" }}>
      {/* Header */}
      <Paper
        sx={{
          backgroundColor: "#1e1e1e",
          borderBottom: "1px solid #333",
          borderRadius: 0,
          py: 2,
          px: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => router.back()}
              sx={{
                color: "#42a5f5",
                "&:hover": {
                  backgroundColor: "rgba(66, 165, 245, 0.1)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body1" sx={{ color: "#42a5f5", fontWeight: 500 }}>
              Nazad
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#42a5f5",
              fontWeight: 700,
              fontSize: "1.25rem",
            }}
          >
            FixTrack
          </Typography>
          <Box sx={{ width: 80 }} /> {/* Spacer for centering */}
        </Box>
      </Paper>

      {/* Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
            Ostali Issue-i
          </Typography>
          <Typography variant="body1" sx={{ color: "#b0b0b0" }}>
            Pregled svih issue-a organizovanih po kategorijama (osim onih sa statusom "primljeno")
          </Typography>
        </Box>

        <Paper
          sx={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #333",
            borderRadius: 2,
            p: 3,
            mb: 4,
          }}
        >
          <IssueFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
        </Paper>

        <Paper
          sx={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #333",
            borderRadius: 2,
            p: 3,
          }}
        >
          <CategorizedIssuesList filters={filters} />
        </Paper>
      </Container>
    </Box>
  )
}
