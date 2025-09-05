"use client"

import { useState } from "react"
import { Box, Container, Paper, Typography } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import IssueFilters from "./IssueFilters"
import IssuesList from "./IssuesList"
import type { FilterState } from "../types"

export default function MyAssignedIssuesLayout() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFrom: "",
    dateTo: "",
    category: "",
    priority: "",
    status: "",
  })

  const handleBack = () => {
    window.history.back()
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#121212" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#1e1e1e",
          borderBottom: "1px solid #333",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            <Box
              onClick={handleBack}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                color: "#fff",
                "&:hover": { color: "#42a5f5" },
              }}
            >
              <ArrowBackIcon />
              <Typography variant="body1">Nazad</Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              FixTrack
            </Typography>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ color: "#fff", mb: 3, fontWeight: "bold" }}>
          Moje Dodijeljene Prijave
        </Typography>

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2a2a2a",
            border: "1px solid #333",
            p: 3,
            mb: 3,
          }}
        >
          <IssueFilters filters={filters} onFiltersChange={setFilters} />
        </Paper>

        {/* Issues List */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2a2a2a",
            border: "1px solid #333",
            p: 3,
          }}
        >
          <IssuesList filters={filters} />
        </Paper>
      </Container>
    </Box>
  )
}
