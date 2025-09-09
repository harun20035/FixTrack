"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import DashboardLayout from "./components/DashboardLayout"
import QuickActions from "./components/QuickActions"
import StatsCards from "./components/StatsCards"
import RecentReports from "./components/RecentReports"
import ProgressOverview from "./components/ProgressOverview"
import ProtectedRoute from "@/components/ProtectedRoute"
import { getTenantDashboard, TenantDashboardData } from "../../utils/dashboardApi"
import { getCurrentUserRole, ROLES } from "@/utils/roleUtils"

export default function Dashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<TenantDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Frontend role check PRIJE svega
  useEffect(() => {
    const userRole = getCurrentUserRole()
    
    // Ako nije stanar ili izvođač, preusmjeri na unauthorized
    if (userRole !== ROLES.STANAR && userRole !== ROLES.IZVOĐAČ) {
      router.replace("/unauthorized")
      return
    }
  }, [router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getTenantDashboard()
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška pri dohvatanju podataka")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress />
          </Box>
        </Container>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        </Container>
      </DashboardLayout>
    )
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 4 }}>
            Nema dostupnih podataka
          </Alert>
        </Container>
      </DashboardLayout>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Dobrodošli nazad! Evo pregleda vaših prijava kvarova.
            </Typography>
          </Box>

          {/* Quick Actions */}
          <QuickActions />

          {/* Stats Cards */}
          <StatsCards stats={dashboardData.stats} />

          {/* Main Content Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "2fr 1fr",
              },
              gap: 4,
            }}
          >
            <RecentReports recentIssues={dashboardData.recent_issues} />
            <ProgressOverview stats={dashboardData.stats} />
          </Box>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
