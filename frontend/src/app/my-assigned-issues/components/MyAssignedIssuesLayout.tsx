"use client"

import { useState } from "react"
import { Box, Container, Paper, Typography, AppBar, Toolbar, Button } from "@mui/material"
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useRouter } from "next/navigation"
import IssueFilters from "./IssueFilters"
import IssuesList from "./IssuesList"
import type { FilterState } from "../types"

function FixTrackIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="large">
      <circle cx="16" cy="16" r="15" fill="#42a5f5" />
      <rect x="10" y="10" width="12" height="12" rx="3" fill="#111" />
    </SvgIcon>
  )
}

export default function MyAssignedIssuesLayout() {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFrom: "",
    dateTo: "",
    category: "",
    priority: "",
    status: "",
  })

  const handleBack = () => {
    router.back()
  }

  const handleHome = () => {
    router.push("/")
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#121212" }}>
      {/* Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          background: "#181818",
          borderBottom: "1px solid #333",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{
                color: "#42a5f5",
                "&:hover": {
                  backgroundColor: "rgba(66, 165, 245, 0.1)",
                },
              }}
            >
              Nazad
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleHome}
          >
            <FixTrackIcon sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 700,
                "&:hover": {
                  color: "#1976d2",
                },
              }}
            >
              FixTrack
            </Typography>
          </Box>
          <Box sx={{ width: "100px" }} /> {/* Spacer for centering */}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ py: 3 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#42a5f5",
                fontWeight: 700,
                mb: 1,
              }}
            >
              Moje Dodijeljene Prijave
            </Typography>
            <Typography variant="body1" sx={{ color: "#b0b0b0", mb: 2 }}>
              Pregled svih prijava kvarova koji su vam dodijeljeni
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Kao izvođač, možete vidjeti sve prijave koje su vam dodijeljene i upravljati njima
            </Typography>
          </Box>

          {/* Filters */}
          <Paper
            sx={{
              backgroundColor: "#1e1e1e",
              border: "1px solid #333",
              borderRadius: 2,
              p: 3,
              mb: 3,
            }}
          >
            <IssueFilters filters={filters} onFiltersChange={setFilters} />
          </Paper>

          {/* Issues List */}
          <Paper
            sx={{
              backgroundColor: "#1e1e1e",
              border: "1px solid #333",
              borderRadius: 2,
              p: 3,
            }}
          >
            <IssuesList filters={filters} />
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
