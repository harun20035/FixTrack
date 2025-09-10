"use client"

import { useState, useEffect, useMemo } from "react"
import { Box, Typography, Grid, CircularProgress, Alert } from "@mui/material"
import IssueCard from "./IssueCard"
import { authFetch } from "@/utils/authFetch"
import type { FilterState, Assignment } from "../types"

interface IssuesListProps {
  filters: FilterState
}

export default function IssuesList({ filters }: IssuesListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dohvati podatke iz backend-a
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await authFetch("http://localhost:8000/api/contractor/assignments")

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Niste prijavljeni")
          } else if (response.status === 403) {
            throw new Error("Nemate prava za pristup ovoj stranici")
          } else {
            throw new Error("Greška pri dohvatanju podataka")
          }
        }
        
        const data = await response.json()
        console.log("Backend response:", data)
        if (data.success) {
          console.log("Assignments data:", data.data)
          // Provjeri da li su podaci valjani
          if (Array.isArray(data.data)) {
            setAssignments(data.data)
          } else {
            console.error("Backend nije vratio array:", data.data)
            setAssignments([])
          }
        } else {
          throw new Error("Greška u odgovoru servera")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepoznata greška")
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const filteredAssignments = useMemo(() => {
    console.log("🔍 Filtering assignments with filters:", filters)
    console.log("📊 Total assignments:", assignments.length)
    
    return assignments.filter((assignment) => {
      const issue = assignment.issue
      if (!issue) return false
      
      const matchesSearch =
        !filters.search ||
        issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (issue.description && issue.description.toLowerCase().includes(filters.search.toLowerCase())) ||
        (issue.tenant?.full_name && issue.tenant.full_name.toLowerCase().includes(filters.search.toLowerCase()))

      const matchesLocation = !filters.location || (issue.location && issue.location.toLowerCase().includes(filters.location.toLowerCase()))
      const matchesStatus = !filters.status || issue.status === filters.status

      const matchesDateFrom = !filters.dateFrom || issue.created_at >= filters.dateFrom
      const matchesDateTo = !filters.dateTo || issue.created_at <= filters.dateTo

      // Debug log za status
      if (filters.status) {
        console.log(`🔍 Status filter: "${filters.status}" vs Issue status: "${issue.status}" - Match: ${matchesStatus}`)
      }

      // Debug log za lokaciju
      if (filters.location) {
        console.log(`🔍 Location filter: "${filters.location}" vs Issue location: "${issue.location}" - Match: ${matchesLocation}`)
      }

      return matchesSearch && matchesLocation && matchesStatus && matchesDateFrom && matchesDateTo
    })
  }, [assignments, filters])

  const handleStatusChange = (assignmentId: number, newStatus: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, issue: { ...assignment.issue, status: newStatus } }
          : assignment
      )
    )
  }

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

  if (filteredAssignments.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" sx={{ color: "#b0b0b0", mb: 1 }}>
          Nema dodijeljenih prijava
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          {filters.search ||
          filters.location ||
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
        Ukupno prijava: {filteredAssignments.length}
      </Typography>

      {/* @ts-ignore */}
      <Grid container spacing={2}>
        {filteredAssignments.map((assignment) => (
          // @ts-ignore
          <Grid item xs={12} md={6} key={assignment.id}>
            <IssueCard 
              assignment={assignment} 
              onStatusChange={handleStatusChange}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
