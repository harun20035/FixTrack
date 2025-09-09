"use client"

import { Card, CardContent, Typography, Box, Avatar, Chip } from "@mui/material"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import type { Tenant } from "../types"

interface TenantCardProps {
  tenant: Tenant
}

export default function TenantCard({ tenant }: TenantCardProps) {
  const getInitials = (fullName: string) => {
    const names = fullName.split(" ")
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`
    }
    return fullName.charAt(0).toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <>
      <Card
        sx={{
          backgroundColor: "#2a2a2a",
          border: "1px solid #333",
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            borderColor: "#42a5f5",
            boxShadow: "0 8px 25px rgba(66, 165, 245, 0.15)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header with Avatar and Name */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#42a5f5",
                width: 50,
                height: 50,
                mr: 2,
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {getInitials(tenant.full_name)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
                {tenant.full_name}
              </Typography>
              <Chip
                label="AKTIVAN"
                size="small"
                sx={{
                  bgcolor: "#4caf50",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              />
            </Box>
          </Box>

          {/* Contact Info */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmailIcon sx={{ color: "#b0b0b0", fontSize: 18, mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                {tenant.email}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PhoneIcon sx={{ color: "#b0b0b0", fontSize: 18, mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                {tenant.phone || "Nije uneseno"}
              </Typography>
            </Box>
          </Box>

          {/* Registration Date */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CalendarTodayIcon sx={{ color: "#b0b0b0", fontSize: 18, mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                Registrovan: {formatDate(tenant.created_at)}
              </Typography>
            </Box>
          </Box>

        </CardContent>
      </Card>

    </>
  )
}
