import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/material/styles"
import ListAltIcon from "@mui/icons-material/ListAlt"
import PendingIcon from "@mui/icons-material/Pending"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import BuildIcon from "@mui/icons-material/Build"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"

const StatsCard = styled(Card)(({ theme }) => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#42a5f5",
    boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
  },
}))

export default function ManagerStatsCards() {
  const stats = [
    {
      icon: <ListAltIcon sx={{ fontSize: 40, color: "#42a5f5", mb: 2 }} />,
      value: "47",
      label: "Ukupno Prijava",
      subtitle: "Ovaj mjesec",
      color: "#42a5f5",
    },
    {
      icon: <PendingIcon sx={{ fontSize: 40, color: "#ff9800", mb: 2 }} />,
      value: "12",
      label: "Na Čekanju",
      subtitle: "Potrebna dodjela",
      color: "#ff9800",
    },
    {
      icon: <BuildIcon sx={{ fontSize: 40, color: "#f44336", mb: 2 }} />,
      value: "8",
      label: "U Toku",
      subtitle: "Aktivni zadaci",
      color: "#f44336",
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#4caf50", mb: 2 }} />,
      value: "27",
      label: "Završeno",
      subtitle: "Ovaj mjesec",
      color: "#4caf50",
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: "#9c27b0", mb: 2 }} />,
      value: "2.8",
      label: "Prosječno Vrijeme",
      subtitle: "dana rješavanja",
      color: "#9c27b0",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#ffc107", mb: 2 }} />,
      value: "94%",
      label: "Uspješnost",
      subtitle: "riješenih kvarova",
      color: "#ffc107",
    },
  ]

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(6, 1fr)",
        },
        gap: 3,
        mb: 4,
      }}
    >
      {stats.map((stat, index) => (
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
