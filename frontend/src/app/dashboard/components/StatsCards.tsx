import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/material/styles"
import BuildIcon from "@mui/icons-material/Build"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PendingIcon from "@mui/icons-material/Pending"
import WarningIcon from "@mui/icons-material/Warning"

const StatsCard = styled(Card)(() => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#42a5f5",
    boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
  },
}))

export default function StatsCards() {
  const stats = [
    {
      icon: <BuildIcon sx={{ fontSize: 40, color: "#42a5f5", mb: 2 }} />,
      value: "12",
      label: "Ukupno Prijava",
      color: "#42a5f5",
    },
    {
      icon: <PendingIcon sx={{ fontSize: 40, color: "#ff9800", mb: 2 }} />,
      value: "3",
      label: "U Toku",
      color: "#ff9800",
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#4caf50", mb: 2 }} />,
      value: "8",
      label: "Završeno",
      color: "#4caf50",
    },
    {
      icon: <WarningIcon sx={{ fontSize: 40, color: "#f44336", mb: 2 }} />,
      value: "1",
      label: "Hitno",
      color: "#f44336",
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
            <Typography variant="body2" color="text.secondary">
              {stat.label}
            </Typography>
          </CardContent>
        </StatsCard>
      ))}
    </Box>
  )
}
