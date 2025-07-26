"use client"

import { useMemo } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import { IssueCard } from "./IssueCard"
import type { FilterState, Issue } from "../types"

interface CategorizedIssuesListProps {
  filters: FilterState
}

// Mock data - issues with statuses other than "primljeno"
const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Popravka slavine u kuhinji",
    description: "Slavina u kuhinji kaplje već nekoliko dana",
    category: "voda",
    priority: "srednji",
    status: "u toku",
    tenant: {
      name: "Ana Marić",
      apartment: "Stan 12",
      phone: "+387 61 123 456",
    },
    location: "Kuhinja - glavna slavina",
    dateReported: "2024-01-15",
    contractor: "Marko Vodoinstalater",
  },
  {
    id: "2",
    title: "Završena popravka struje",
    description: "Zamijenjen je prekidač u dnevnoj sobi",
    category: "struja",
    priority: "visok",
    status: "završeno",
    tenant: {
      name: "Petar Nikolić",
      apartment: "Stan 8",
      phone: "+387 61 234 567",
    },
    location: "Dnevna soba - glavni prekidač",
    dateReported: "2024-01-10",
    contractor: "Stefan Električar",
  },
  {
    id: "3",
    title: "Čeka se dio za grijanje",
    description: "Potreban je novi termostat za radijator",
    category: "grijanje",
    priority: "srednji",
    status: "na čekanju",
    tenant: {
      name: "Milica Jovanović",
      apartment: "Stan 15",
      phone: "+387 61 345 678",
    },
    location: "Spavaća soba - radijator",
    dateReported: "2024-01-12",
  },
  {
    id: "4",
    title: "Otkazana popravka vrata",
    description: "Stanar je odustao od popravke",
    category: "ostalo",
    priority: "nizak",
    status: "otkazano",
    tenant: {
      name: "Jovana Stojanović",
      apartment: "Stan 3",
      phone: "+387 61 456 789",
    },
    location: "Ulazna vrata",
    dateReported: "2024-01-08",
  },
  {
    id: "5",
    title: "Popravka u toku - WC šolja",
    description: "Zamjena WC šolje u kupaonici",
    category: "voda",
    priority: "visok",
    status: "u toku",
    tenant: {
      name: "Nikola Mitrović",
      apartment: "Stan 20",
      phone: "+387 61 567 890",
    },
    location: "Kupaonica - WC",
    dateReported: "2024-01-14",
    contractor: "Dragan Vodoinstalater",
  },
  {
    id: "6",
    title: "Završeno - Popravka sijalice",
    description: "Zamijenjena LED sijalica u hodniku",
    category: "struja",
    priority: "nizak",
    status: "završeno",
    tenant: {
      name: "Marija Pavlović",
      apartment: "Stan 7",
      phone: "+387 61 678 901",
    },
    location: "Hodnik - glavna sijalica",
    dateReported: "2024-01-09",
    contractor: "Milan Električar",
  },
]

const categories = [
  { key: "voda", name: "Voda", color: "#2196f3" },
  { key: "struja", name: "Struja", color: "#ff9800" },
  { key: "grijanje", name: "Grijanje", color: "#f44336" },
  { key: "ostalo", name: "Ostalo", color: "#9c27b0" },
]

export function CategorizedIssuesList({ filters }: CategorizedIssuesListProps) {
  const filteredIssues = useMemo(() => {
    return mockIssues.filter((issue) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          issue.title.toLowerCase().includes(searchLower) ||
          issue.description.toLowerCase().includes(searchLower) ||
          issue.tenant.name.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Date filters
      if (filters.dateFrom && issue.dateReported < filters.dateFrom) return false
      if (filters.dateTo && issue.dateReported > filters.dateTo) return false

      // Category filter
      if (filters.category && issue.category !== filters.category) return false

      // Priority filter
      if (filters.priority && issue.priority !== filters.priority) return false

      // Status filter
      if (filters.status && issue.status !== filters.status) return false

      return true
    })
  }, [filters])

  const issuesByCategory = useMemo(() => {
    const grouped: Record<string, Issue[]> = {}

    categories.forEach((category) => {
      grouped[category.key] = filteredIssues.filter((issue) => issue.category === category.key)
    })

    return grouped
  }, [filteredIssues])

  const totalIssues = filteredIssues.length

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600 }}>
          Issue-i po kategorijama
        </Typography>
        <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
          Ukupno: {totalIssues} issue{totalIssues !== 1 ? "-a" : ""}
        </Typography>
      </Box>

      {totalIssues === 0 ? (
        <Box
          sx={{
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            borderRadius: 2,
            p: 6,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "#b0b0b0" }}>
            Nema issue-a koji odgovaraju filterima
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {categories.map((category) => {
            const categoryIssues = issuesByCategory[category.key]

            if (categoryIssues.length === 0) return null

            return (
              <Box key={category.key}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: 1,
                      backgroundColor: category.color,
                    }}
                  />
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                    ({categoryIssues.length})
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {categoryIssues.map((issue) => (
                    <Grid item xs={12} lg={6} key={issue.id}>
                      <IssueCard issue={issue} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
