"use client"
import { useState, useMemo, useEffect } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Chip from "@mui/material/Chip"
import { styled } from "@mui/material/styles"
import ContractorIssueCard from "./ContractorIssueCard"
import IssueFilters from "./IssueFilters"
import type { Assignment, FilterOptions } from "../types"
import { authFetch } from "@/utils/authFetch"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"

const CategorySection = styled(Paper)(({ theme }) => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 12,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}))

export default function ContractorIssuesList() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    status: "",
    dateFrom: "",
    dateTo: ""
  })

  // Fetch assignments from backend
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true)
        const response = await authFetch("http://localhost:8000/api/contractor/assignments")
        
        if (!response.ok) {
          throw new Error('Greška prilikom dohvata podataka')
        }
        
        const data = await response.json()
        
        if (data.success && data.data) {
          setAssignments(data.data)
        } else {
          setError("Greška pri dohvatanju podataka")
        }
      } catch (err) {
        setError("Greška pri dohvatanju podataka")
        console.error("Error fetching assignments:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const handleStatusChange = (assignmentId: number, newStatus: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: newStatus }
          : assignment
      )
    )
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  // Filter assignments based on search and status
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      const matchesSearch = filters.searchTerm === "" || 
        assignment.issue.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (assignment.tenant && assignment.tenant.full_name && assignment.tenant.full_name.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      
      const matchesStatus = filters.status === "" || assignment.status === filters.status
      
      const matchesDateFrom = !filters.dateFrom || 
        new Date(assignment.created_at) >= new Date(filters.dateFrom)
      
      const matchesDateTo = !filters.dateTo || 
        new Date(assignment.created_at) <= new Date(filters.dateTo)
      
      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
    })
  }, [assignments, filters])

  // Group assignments by status
  const assignmentsByStatus = useMemo(() => {
    const statusCategories = ["Dodijeljeno", "U toku", "Čeka dijelove", "Završeno", "Otkazano"]
    const grouped: Record<string, Assignment[]> = {}

    statusCategories.forEach((status) => {
      grouped[status] = filteredAssignments.filter((assignment) => assignment.status === status)
    })

    return grouped
  }, [filteredAssignments])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Dodijeljeno":
        return "📋"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Dodijeljeno":
        return "#8B5CF6"
      case "U toku":
        return "#3B82F6"
      case "Čeka dijelove":
        return "#F59E0B"
      case "Završeno":
        return "#22C55E"
      case "Otkazano":
        return "#EF4444"
      default:
        return "#42a5f5"
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Moje Dodijeljene Prijave
      </Typography>

      {/* Filters */}
      <IssueFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {Object.entries(assignmentsByStatus).map(([status, statusAssignments]) => {
        if (statusAssignments.length === 0) return null

        return (
          <CategorySection key={status}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
                {getStatusIcon(status)}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: getStatusColor(status),
                }}
              >
                {status}
              </Typography>
              <Chip
                label={statusAssignments.length}
                sx={{
                  backgroundColor: getStatusColor(status),
                  color: "white",
                  fontWeight: 600,
                  minWidth: "32px",
                }}
              />
            </Box>

            <Grid container spacing={3}>
              {statusAssignments.map((assignment) => (
                <Grid item xs={12} md={6} key={assignment.id}>
                  <ContractorIssueCard 
                    assignment={assignment} 
                    onStatusChange={handleStatusChange} 
                  />
                </Grid>
              ))}
            </Grid>
          </CategorySection>
        )
      })}

      {filteredAssignments.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Nema dodijeljenih prijava
          </Typography>
          <Typography variant="body1">Trenutno nemate dodijeljenih prijava kvarova.</Typography>
        </Box>
      )}
    </Box>
  )
}
