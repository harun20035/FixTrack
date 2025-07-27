"use client"
import Box from "@mui/material/Box"
import type React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useRouter } from "next/navigation"

function FixTrackIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="large">
      <circle cx="16" cy="16" r="15" fill="#42a5f5" />
      <rect x="10" y="10" width="12" height="12" rx="3" fill="#111" />
    </SvgIcon>
  )
}

interface AssignedIssuesLayoutProps {
  children: React.ReactNode
}

export default function AssignedIssuesLayout({ children }: AssignedIssuesLayoutProps) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleHome = () => {
    router.push("/")
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#121212" }}>
      {/* Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          background: "#1e1e1e",
          borderBottom: "1px solid #333",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{
                color: "#42a5f5",
                "&:hover": {
                  backgroundColor: "rgba(66, 165, 245, 0.1)",
                },
              }}
            >
              Nazad
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleHome}
          >
            <FixTrackIcon sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 700,
                "&:hover": {
                  color: "#1976d2",
                },
              }}
            >
              FixTrack
            </Typography>
          </Box>
          <Box sx={{ width: "100px" }} /> {/* Spacer for centering */}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main">{children}</Box>
    </Box>
  )
}
