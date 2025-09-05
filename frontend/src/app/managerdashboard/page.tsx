"use client"
import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import ManagerDashboardLayout from "./components/ManagerDashboardLayout"
import ManagerQuickActions from "./components/ManagerQuickActions"
import ManagerStatsCards from "./components/ManagerStatsCards"
import AllReports from "./components/AllReports"
import SystemOverview from "./components/SystemOverview"
import { getManagerDashboard, ManagerDashboardData } from "../../utils/dashboardApi"

export default function ManagerDashboard() {
  const [dashboardData, setDashboardData] = useState<ManagerDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getManagerDashboard()
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
      <ManagerDashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress />
          </Box>
        </Container>
      </ManagerDashboardLayout>
    )
  }

  if (error) {
    return (
      <ManagerDashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        </Container>
      </ManagerDashboardLayout>
    )
  }

  if (!dashboardData) {
    return (
      <ManagerDashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 4 }}>
            Nema dostupnih podataka
          </Alert>
        </Container>
      </ManagerDashboardLayout>
    )
  }

  return (
    <ManagerDashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
            Upravnik Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Dobrodošli nazad! Evo pregleda svih prijava kvarova i aktivnosti u zgradama.
          </Typography>
        </Box>

        {/* Quick Actions */}
        <ManagerQuickActions />

        {/* Stats Cards */}
        <ManagerStatsCards stats={dashboardData.stats} />

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
          <AllReports recentIssues={dashboardData.recent_issues} />
          <SystemOverview stats={dashboardData.stats} />
        </Box>
      </Container>
    </ManagerDashboardLayout>
  )
}
