"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import SurveyForm from "./components/SurveyForm"

function FixTrackIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="large">
      <circle cx="16" cy="16" r="15" fill="#42a5f5" />
      <rect x="10" y="10" width="12" height="12" rx="3" fill="#111" />
    </SvgIcon>
  )
}

export default function SurveyPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleHome = () => {
    router.push("/")
  }

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#121212" }}>
        {/* Header */}
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{
            background: "#181818",
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
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: "#1e1e1e",
              border: "1px solid #333",
              borderRadius: 2,
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                color="primary"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Prijava Nezadovoljstva
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vaše mišljenje je važno za nas. Molimo vas da podijelite svoje iskustvo i pomognete nam da poboljšamo kvalitet usluge. 
              </Typography>
            </Box>

            <SurveyForm />
          </Paper>
        </Container>
      </Box>
    </ProtectedRoute>
  )
}
