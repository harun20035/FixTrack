"use client"

import { useState, useEffect, useMemo } from "react"
import { Typography, Box, CircularProgress, Alert } from "@mui/material"
import TenantCard from "./TenantCard"
import { authFetch } from "@/utils/authFetch"
import type { Tenant } from "../types"

interface TenantsListProps {
  searchTerm: string
}

export default function TenantsList({ searchTerm }: TenantsListProps) {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dohvati podatke sa backend-a
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await authFetch("http://localhost:8000/api/manager/tenants")
        if (!response.ok) {
          throw new Error("Greška pri dohvatanju podataka")
        }
        
        const allTenants: Tenant[] = await response.json()
        
        // Filtriraj samo stanare (role_id = 1)
        const filteredTenants = allTenants.filter(tenant => tenant.role_id === 1)
        
        setTenants(filteredTenants)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepoznata greška")
      } finally {
        setLoading(false)
      }
    }

    fetchTenants()
  }, [])

  const filteredTenants = useMemo(() => {
    if (!searchTerm.trim()) return tenants

    return tenants.filter((tenant) =>
      tenant.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [tenants, searchTerm])

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

  if (filteredTenants.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" sx={{ color: "#b0b0b0", mb: 1 }}>
          Nema rezultata
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          Pokušajte sa drugim pojmom pretrage
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3 }}>
      {filteredTenants.map((tenant) => (
        <TenantCard key={tenant.id} tenant={tenant} />
      ))}
    </Box>
  )
}
