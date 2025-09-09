"use client"
import { useState, useEffect } from "react"
import { Grid, Typography, Box, CircularProgress, Alert } from "@mui/material"
import IssueHistoryCard from "./IssueHistoryCard"
import type { CompletedIssue } from "../types"
import { authFetch } from "@/utils/authFetch"

export default function IssueHistoryList() {
  const [completedIssues, setCompletedIssues] = useState<CompletedIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompletedIssues = async () => {
      try {
        setLoading(true)
        const response = await authFetch("http://localhost:8000/api/contractor/completed-issues")
        
        if (response.ok) {
          const result = await response.json()
          setCompletedIssues(result.data)
        } else {
          setError("Greška pri dohvatanju završenih kvarova")
        }
      } catch (error) {
        console.error("Greška pri dohvatanju završenih kvarova:", error)
        setError("Greška pri dohvatanju završenih kvarova")
      } finally {
        setLoading(false)
      }
    }

    fetchCompletedIssues()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#42a5f5" }} />
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
      <Typography
        variant="h6"
        sx={{
          color: "#b0b0b0",
          mb: 2,
        }}
      >
        Ukupno završenih kvarova: {completedIssues.length}
      </Typography>

      {completedIssues.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" sx={{ color: "#b0b0b0", mb: 1 }}>
            Nema završenih kvarova
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Kada završite svoje prve kvarove, oni će se pojaviti ovdje
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {completedIssues.map((issue) => (
            <Grid item xs={12} md={6} key={issue.id}>
              <IssueHistoryCard issue={issue} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
