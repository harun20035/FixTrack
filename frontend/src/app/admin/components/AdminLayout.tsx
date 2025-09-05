"use client"
import { Box, Container, Paper, Typography, IconButton, Grid } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useRouter } from "next/navigation"
import RoleRequests from "./RoleRequests"
import UserManagement from "./UserManagement"
import SystemSettings from "./SystemSettings"

export default function AdminLayout() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#121212",
        color: "#fff",
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#1e1e1e",
          borderBottom: "1px solid #333",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={handleBack}
                sx={{
                  color: "#fff",
                  "&:hover": { bgcolor: "#333" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="body1" sx={{ color: "#fff" }}>
                Nazad
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#42a5f5",
              }}
            >
              FixTrack
            </Typography>

            <Box sx={{ width: 80 }} />
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Admin Panel
        </Typography>

        <Grid container spacing={3}>
          {/* Role Requests */}
          <Grid item xs={12} lg={8}>
            <RoleRequests />
          </Grid>

          {/* User Management & System Settings */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <UserManagement />
              </Grid>
              <Grid item xs={12}>
                <SystemSettings />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
