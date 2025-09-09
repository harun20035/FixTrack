"use client"
import { ReactNode } from "react"
import { useRoleAccess } from "@/hooks/useRoleAccess"
import { Box, CircularProgress, Typography } from "@mui/material"

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoading, hasAccess } = useRoleAccess()

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" color="primary">
          Provjera pristupa...
        </Typography>
      </Box>
    )
  }

  if (!hasAccess) {
    return fallback || null
  }

  return <>{children}</>
}
