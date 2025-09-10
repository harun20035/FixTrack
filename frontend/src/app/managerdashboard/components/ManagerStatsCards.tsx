import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/material/styles"
import ListAltIcon from "@mui/icons-material/ListAlt"
import PendingIcon from "@mui/icons-material/Pending"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import BuildIcon from "@mui/icons-material/Build"
import { ManagerStats } from "../../../utils/dashboardApi"

const StatsCard = styled(Card)(({ theme }) => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#42a5f5",
    boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
  },
}))

interface ManagerStatsCardsProps {
  stats: ManagerStats | null
}

export default function ManagerStatsCards({ stats }: ManagerStatsCardsProps) {
  // Provjeri da li stats postoji i ima potrebne properties
  if (!stats) {
    return null
  }

  const statsData = [
    {
      icon: <ListAltIcon sx={{ fontSize: 40, color: "#42a5f5", mb: 2 }} />,
      value: (stats.total_issues ?? 0).toString(),
      label: "Ukupno Prijava",
      subtitle: "Za sve vrijeme",
      color: "#42a5f5",
    },
    {
      icon: <PendingIcon sx={{ fontSize: 40, color: "#ff9800", mb: 2 }} />,
      value: (stats.pending_assignment ?? 0).toString(),
      label: "Na Čekanju",
      subtitle: "Potrebna dodjela",
      color: "#ff9800",
    },
    {
      icon: <BuildIcon sx={{ fontSize: 40, color: "#f44336", mb: 2 }} />,
      value: (stats.in_progress ?? 0).toString(),
      label: "Popravka u toku",
      subtitle: "Aktivni zadaci",
      color: "#f44336",
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#4caf50", mb: 2 }} />,
      value: (stats.completed_total ?? 0).toString(),
      label: "Završeno",
      subtitle: "Ukupno",
      color: "#4caf50",
    },
  ]

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 3,
        mb: 4,
      }}
    >
      {statsData.map((stat, index) => (
        <StatsCard key={index}>
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            {stat.icon}
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: stat.color }}>
              {stat.value}
            </Typography>
            <Typography variant="body1" color="primary" sx={{ fontWeight: 600, mb: 0.5 }}>
              {stat.label}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
              {stat.subtitle}
            </Typography>
          </CardContent>
        </StatsCard>
      ))}
    </Box>
  )
}
