"use client"

import { useState, useEffect, useMemo } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import { IssueCard } from "./IssueCard"
import { authFetch } from "@/utils/authFetch"
import type { FilterOptions, Issue } from "../types"

interface CategorizedIssuesListProps {
  filters: FilterOptions
}

// Status kategorije za organizovanje issue-a
const statusCategories = [
  {
    key: "Dodijeljeno izvođaču",
    name: "Dodijeljeno izvođaču",
    color: "#2196f3",
    description: "Prijave koje su dodijeljene izvođaču"
  },
  {
    key: "Na lokaciji",
    name: "Na lokaciji",
    color: "#ff9800",
    description: "Izvođač je na lokaciji"
  },
  {
    key: "Popravka u toku",
    name: "Popravka u toku",
    color: "#f44336",
    description: "Popravka je u toku"
  },
  {
    key: "Čeka dijelove",
    name: "Čeka dijelove",
    color: "#ffc107",
    description: "Čeka se nabavka dijelova"
  },
  {
    key: "Završeno",
    name: "Završeno",
    color: "#4caf50",
    description: "Popravka je završena"
  },
  {
    key: "Otkazano",
    name: "Otkazano",
    color: "#9e9e9e",
    description: "Prijava je otkazana"
  }
]

export function CategorizedIssuesList({ filters }: CategorizedIssuesListProps) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dohvati podatke sa backend-a
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Dohvati issue-e koji nisu "Primljeno" koristeći novi endpoint
         
         const params = new URLSearchParams()
         if (filters.searchTerm) {
           params.append('search', filters.searchTerm)
         }
         if (filters.category && filters.category !== 'all') {
           params.append('category', filters.category)
         }
         if (filters.dateFrom) {
           params.append('date_from', filters.dateFrom)
         }
         if (filters.dateTo) {
           params.append('date_to', filters.dateTo)
         }
         if (filters.address) {
           params.append('address', filters.address)
         }
         if (filters.contractor) {
           params.append('contractor', filters.contractor)
         }
         params.append('sort_by', 'created_at_desc')
         
         const response = await authFetch(`http://localhost:8000/api/manager/other-issues?${params}`)
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Greška pri dohvatanju podataka: ${response.status} ${errorText}`)
        }
        
        const otherIssues: Issue[] = await response.json()
        setIssues(otherIssues)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepoznata greška")
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [])

  // Refetch kada se filteri promene
  useEffect(() => {
    fetchIssues()
  }, [filters])

  // Koristimo server-side filtering, tako da ne treba client-side filtering
  const filteredIssues = issues

  const issuesByStatus = useMemo(() => {
    const grouped: Record<string, Issue[]> = {}

    statusCategories.forEach((status) => {
      grouped[status.key] = filteredIssues.filter((issue) => issue.status === status.key)
    })

    return grouped
  }, [filteredIssues])

  const totalIssues = filteredIssues.length

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600 }}>
          Kvarovi po statusima
        </Typography>
        <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
          Ukupno: {totalIssues} kvar{totalIssues !== 1 ? "ova" : ""}
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
            Nema kvarova koji odgovaraju filterima
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {statusCategories.map((status) => {
            const statusIssues = issuesByStatus[status.key]

            if (statusIssues.length === 0) return null

            return (
              <Box key={status.key}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: 1,
                      backgroundColor: status.color,
                    }}
                  />
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                    {status.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                    ({statusIssues.length})
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", ml: 2 }}>
                    {status.description}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {statusIssues.map((issue) => (
                    <Grid item xs={12} lg={6} key={issue.id}>
                      <IssueCard issue={issue} onStatusChange={(updatedIssue) => {
                        // Ažuriraj lokalno stanje kada se promijeni status
                        setIssues(prev => prev.map(i => i.id === updatedIssue.id ? updatedIssue : i))
                      }} />
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
