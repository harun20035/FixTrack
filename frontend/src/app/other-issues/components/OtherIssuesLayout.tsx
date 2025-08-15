"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { IssueFilters } from "./IssueFilters"
import { CategorizedIssuesList } from "./CategorizedIssuesList"
import type { FilterOptions } from "../types"

export function OtherIssuesLayout() {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    dateFrom: "",
    dateTo: "",
    category: "all",
    priority: "all",
  })

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      dateFrom: "",
      dateTo: "",
      category: "all",
      priority: "all",
    })
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#121212" }}>
      {/* Header */}
      <Box
        sx={{
          background: "#181818",
          borderBottom: "1px solid #333",
          p: 3,
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          sx={{
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Ostale Prijave Kvarova
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            textAlign: "center",
            mt: 1,
          }}
        >
          Pregled i upravljanje svim prijavama koje nisu u statusu "Primljeno"
        </Typography>
      </Box>

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
              Ostali kvarovi
          </Typography>
            <Typography variant="body1" sx={{ color: "#b0b0b0", mb: 2 }}>
              Pregled svih prijava kvarova organizovanih po kategorijama (osim onih sa statusom "Primljeno")
          </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Kao upravnik, možete vidjeti sve prijave i promijeniti njihov status
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
            <IssueFilters filters={filters} onFilterChange={handleFilterChange} />
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
          <CategorizedIssuesList filters={filters} />
        </Paper>
      </Container>
      </Box>
    </Box>
  )
}
