"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import ContractorDashboardLayout from "./components/ContractorDashboardLayout"
import ContractorQuickActions from "./components/ContractorQuickActions"
import ContractorStatsCards from "./components/ContractorStatsCards"
import AssignedIssues from "./components/AssignedIssues"
import RecentActivity from "./components/RecentActivity"
import ProtectedRoute from "@/components/ProtectedRoute"
import { getContractorDashboard, ContractorDashboardData } from "../../utils/dashboardApi"
import { getCurrentUserRole, ROLES } from "@/utils/roleUtils"

export default function ContractorDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<ContractorDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Frontend role check PRIJE svega
  useEffect(() => {
    const userRole = getCurrentUserRole()
    
    // Ako nije izvođač (role 3), preusmjeri na unauthorized
    if (userRole !== ROLES.IZVOĐAČ) {
      router.replace("/unauthorized")
      return
    }
  }, [router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getContractorDashboard()
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
      <ContractorDashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress />
          </Box>
        </Container>
      </ContractorDashboardLayout>
    )
  }

  if (error) {
    return (
      <ContractorDashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        </Container>
      </ContractorDashboardLayout>
    )
  }

  if (!dashboardData) {
    return (
      <ContractorDashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 4 }}>
            Nema dostupnih podataka
          </Alert>
        </Container>
      </ContractorDashboardLayout>
    )
  }

  return (
    <ProtectedRoute>
      <ContractorDashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              Izvođač Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Dobrodošli nazad! Evo pregleda vaših dodijeljenih zadataka i aktivnosti.
            </Typography>
          </Box>

          {/* Quick Actions */}
          <ContractorQuickActions />

          {/* Stats Cards */}
          <ContractorStatsCards stats={dashboardData.stats} />

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
            <AssignedIssues assignedIssues={dashboardData.assigned_issues} />
            <RecentActivity recentActivities={dashboardData.recent_activities} />
          </Box>
        </Container>
      </ContractorDashboardLayout>
    </ProtectedRoute>
  )
}
