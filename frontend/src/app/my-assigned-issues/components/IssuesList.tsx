"use client"

import { useMemo } from "react"
import { Box, Typography, Grid } from "@mui/material"
import IssueCard from "./IssueCard"
import type { FilterState, Issue } from "../types"

interface IssuesListProps {
  filters: FilterState
}

// Mock data - dodijeljeni issue-i za izvođača
const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Popravka slavine u kuhinji",
    description: "Slavina u kuhinji curi već nekoliko dana",
    category: "voda",
    priority: "visok",
    status: "dodijeljeno",
    tenant: {
      name: "Marko Petrović",
      apartment: "Stan 12",
      phone: "+387 65 123 456",
    },
    location: "Kuhinja - glavna slavina",
    dateReported: "2024-01-15",
    assignedTo: "Petar Nikolić",
  },
  {
    id: "2",
    title: "Problem sa grijanjem",
    description: "Radijatori u dnevnoj sobi ne rade",
    category: "grijanje",
    priority: "srednji",
    status: "u toku",
    tenant: {
      name: "Ana Jovanović",
      apartment: "Stan 8",
      phone: "+387 65 234 567",
    },
    location: "Dnevna soba - radijatori",
    dateReported: "2024-01-14",
    assignedTo: "Petar Nikolić",
  },
  {
    id: "3",
    title: "Prekidač ne radi",
    description: "Prekidač za svjetlo u hodniku ne funkcioniše",
    category: "struja",
    priority: "nizak",
    status: "čeka dijelove",
    tenant: {
      name: "Stefan Nikolić",
      apartment: "Stan 5",
      phone: "+387 65 345 678",
    },
    location: "Hodnik - glavni prekidač",
    dateReported: "2024-01-13",
    assignedTo: "Petar Nikolić",
  },
  {
    id: "4",
    title: "Popravka brave na vratima",
    description: "Brava se teško zaključava",
    category: "ostalo",
    priority: "srednji",
    status: "završeno",
    tenant: {
      name: "Milica Stojanović",
      apartment: "Stan 15",
      phone: "+387 65 456 789",
    },
    location: "Ulazna vrata",
    dateReported: "2024-01-12",
    assignedTo: "Petar Nikolić",
  },
  {
    id: "5",
    title: "Začepljena cijev u kupatilu",
    description: "Voda se sporo odvodi iz lavaboa",
    category: "voda",
    priority: "srednji",
    status: "u toku",
    tenant: {
      name: "Nikola Mitrović",
      apartment: "Stan 3",
      phone: "+387 65 567 890",
    },
    location: "Kupatilo - lavabo",
    dateReported: "2024-01-11",
    assignedTo: "Petar Nikolić",
  },
  {
    id: "6",
    title: "Popravka sijalice",
    description: "Sijalica u spavaćoj sobi ne radi",
    category: "struja",
    priority: "nizak",
    status: "završeno",
    tenant: {
      name: "Jelena Pavlović",
      apartment: "Stan 20",
      phone: "+387 65 678 901",
    },
    location: "Spavaća soba - glavno svjetlo",
    dateReported: "2024-01-10",
    assignedTo: "Petar Nikolić",
  },
]

export default function IssuesList({ filters }: IssuesListProps) {
  const filteredIssues = useMemo(() => {
    return mockIssues.filter((issue) => {
      const matchesSearch =
        !filters.search ||
        issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.tenant.name.toLowerCase().includes(filters.search.toLowerCase())

      const matchesCategory = !filters.category || issue.category === filters.category
      const matchesPriority = !filters.priority || issue.priority === filters.priority
      const matchesStatus = !filters.status || issue.status === filters.status

      const matchesDateFrom = !filters.dateFrom || issue.dateReported >= filters.dateFrom
      const matchesDateTo = !filters.dateTo || issue.dateReported <= filters.dateTo

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesDateFrom && matchesDateTo
    })
  }, [filters])

  if (filteredIssues.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" sx={{ color: "#b0b0b0", mb: 1 }}>
          Nema dodijeljenih prijava
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          {filters.search ||
          filters.category ||
          filters.priority ||
          filters.status ||
          filters.dateFrom ||
          filters.dateTo
            ? "Pokušajte promijeniti filtere"
            : "Trenutno nemate dodijeljenih prijava"}
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
        Ukupno prijava: {filteredIssues.length}
      </Typography>

      <Grid container spacing={2}>
        {filteredIssues.map((issue) => (
          <Grid item xs={12} md={6} key={issue.id}>
            <IssueCard issue={issue} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
