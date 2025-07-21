"use client"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import DashboardLayout from "./components/DashboardLayout"
import QuickActions from "./components/QuickActions"
import StatsCards from "./components/StatsCards"
import RecentReports from "./components/RecentReports"
import ProgressOverview from "./components/ProgressOverview"

export default function Dashboard() {
  return (
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
        <StatsCards />

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
          <RecentReports />
          <ProgressOverview />
        </Box>
      </Container>
    </DashboardLayout>
  )
}
