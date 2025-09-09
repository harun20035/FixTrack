"use client"
import { useRouter } from "next/navigation"
import { Box, Paper, Typography, Button, Container } from "@mui/material"
import { Lock, Home } from "@mui/icons-material"
import { getCurrentUserRole, getDashboardRoute } from "@/utils/roleUtils"

export default function UnauthorizedPage() {
  const router = useRouter()

  const handleGoToDashboard = () => {
    const userRole = getCurrentUserRole()
    if (userRole) {
      const dashboardRoute = getDashboardRoute(userRole)
      router.push(dashboardRoute)
    } else {
      // Fallback ako nema role
      router.push("/dashboard")
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            backgroundColor: "#2a2a2a",
            border: "1px solid #333",
            borderRadius: 3,
            padding: 4,
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Lock Icon */}
          <Box sx={{ mb: 3 }}>
            <Lock
              sx={{
                fontSize: 80,
                color: "#f44336",
                filter: "drop-shadow(0 4px 8px rgba(244, 67, 54, 0.3))",
              }}
            />
          </Box>

          {/* Main Title */}
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "1.8rem", sm: "2.125rem" },
            }}
          >
            Nemate pristup ovoj stranici
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: "#b0b0b0",
              mb: 4,
              lineHeight: 1.6,
              fontSize: "1.1rem",
            }}
          >
            Izvinjavamo se, ali nemate dozvolu za pristup ovoj stranici. Molimo kontaktirajte administratora ili se
            vratite na glavnu stranicu.
          </Typography>

          {/* Go to Dashboard Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={handleGoToDashboard}
            sx={{
              background: "linear-gradient(45deg, #42a5f5 30%, #1e88e5 90%)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.1rem",
              padding: "12px 32px",
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(66, 165, 245, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #1e88e5 30%, #1565c0 90%)",
                boxShadow: "0 6px 20px rgba(66, 165, 245, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Idite na Dashboard
          </Button>

          {/* Additional Info */}
          <Typography
            variant="caption"
            sx={{
              color: "#666",
              mt: 3,
              display: "block",
              fontSize: "0.9rem",
            }}
          >
            Kod greške: 403 - Zabranjen pristup
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
