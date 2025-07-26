"use client"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import ManagerDashboardLayout from "./components/ManagerDashboardLayout"
import ManagerQuickActions from "./components/ManagerQuickActions"
import ManagerStatsCards from "./components/ManagerStatsCards"
import AllReports from "./components/AllReports"
import SystemOverview from "./components/SystemOverview"

export default function ManagerDashboard() {
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
        <ManagerStatsCards />

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
          <AllReports />
          <SystemOverview />
        </Box>
      </Container>
    </ManagerDashboardLayout>
  )
}
