import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/material/styles"
import AssignmentIcon from "@mui/icons-material/Assignment"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import BuildIcon from "@mui/icons-material/Build"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

const StatsCard = styled(Card)(({ theme }) => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#42a5f5",
    boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
  },
}))

export default function ContractorStatsCards() {
  const stats = [
    {
      icon: <AssignmentIcon sx={{ fontSize: 40, color: "#42a5f5", mb: 2 }} />,
      value: "8",
      label: "Dodijeljene Prijave",
      color: "#42a5f5",
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: "#ff9800", mb: 2 }} />,
      value: "3",
      label: "Na Lokaciji",
      color: "#ff9800",
    },
    {
      icon: <BuildIcon sx={{ fontSize: 40, color: "#f44336", mb: 2 }} />,
      value: "2",
      label: "U Toku",
      color: "#f44336",
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#4caf50", mb: 2 }} />,
      value: "15",
      label: "Završeno (Mjesec)",
      color: "#4caf50",
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: "#9c27b0", mb: 2 }} />,
      value: "2.1",
      label: "Prosječno Vrijeme (dani)",
      color: "#9c27b0",
    },
    {
      icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#ffc107", mb: 2 }} />,
      value: "2,450",
      label: "Zarada (KM)",
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
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
              {stat.label}
            </Typography>
          </CardContent>
        </StatsCard>
      ))}
    </Box>
  )
}
