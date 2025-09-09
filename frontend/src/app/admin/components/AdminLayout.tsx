"use client"
import { Box, Container, Paper, Typography, Grid, AppBar, Toolbar, Button, SvgIcon, type SvgIconProps } from "@mui/material"
import { Logout } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import RoleRequests from "./RoleRequests"
import UserManagement from "./UserManagement"
import SystemSettings from "./SystemSettings"
import SurveyManagement from "./SurveyManagement"

function FixTrackIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="large">
      <circle cx="16" cy="16" r="15" fill="#42a5f5" />
      <rect x="10" y="10" width="12" height="12" rx="3" fill="#111" />
    </SvgIcon>
  )
}

export default function AdminLayout() {
  const router = useRouter()

  const handleHome = () => {
    router.push("/")
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_token_exp")
    router.push("/login")
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
              FixTrack - Admin Panel
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              borderColor: "#f44336",
              color: "#f44336",
              "&:hover": {
                borderColor: "#d32f2f",
                backgroundColor: "rgba(244, 67, 54, 0.04)",
              },
            }}
          >
            Odjavi se
          </Button>
        </Toolbar>
      </AppBar>

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
          <Grid item xs={12} lg={6}>
            <RoleRequests />
          </Grid>

          {/* Survey Management */}
          <Grid item xs={12} lg={6}>
            <SurveyManagement />
          </Grid>

          {/* User Management & System Settings */}
          <Grid item xs={12} lg={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <UserManagement />
              </Grid>
              <Grid item xs={12} md={6}>
                <SystemSettings />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
