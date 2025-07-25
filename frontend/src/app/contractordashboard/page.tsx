"use client"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import ContractorDashboardLayout from "./components/ContractorDashboardLayout"
import ContractorQuickActions from "./components/ContractorQuickActions"
import ContractorStatsCards from "./components/ContractorStatsCards"
import AssignedIssues from "./components/AssignedIssues"
import RecentActivity from "./components/RecentActivity"

export default function ContractorDashboard() {
  return (
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
        <ContractorStatsCards />

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
          <AssignedIssues />
          <RecentActivity />
        </Box>
      </Container>
    </ContractorDashboardLayout>
  )
}
