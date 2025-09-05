import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import LinearProgress from "@mui/material/LinearProgress"
import { styled } from "@mui/material/styles"
import { TenantStats } from "../../../utils/dashboardApi"

const StatsCard = styled(Card)(() => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#42a5f5",
    boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
  },
}))

interface ProgressOverviewProps {
  stats: TenantStats
}

export default function ProgressOverview({ stats }: ProgressOverviewProps) {
  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Pregled Napretka
      </Typography>

      {/* Monthly Goal */}
      <StatsCard sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Mjesečni Cilj
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Riješeno {stats.completed} od 10 prijava
          </Typography>
          <LinearProgress
            variant="determinate"
            value={stats.monthly_goal_progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#333",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#42a5f5",
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "right" }}>
            {stats.monthly_goal_progress}%
          </Typography>
        </CardContent>
      </StatsCard>

      {/* Average Resolution Time */}
      <StatsCard sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Prosječno Vrijeme Rješavanja
          </Typography>
          <Typography variant="h4" color="#4caf50" sx={{ fontWeight: 700, mb: 1 }}>
            {stats.average_resolution_time}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            dana
          </Typography>
        </CardContent>
      </StatsCard>

      {/* Satisfaction Rating */}
      <StatsCard>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Ocjena Zadovoljstva
          </Typography>
          <Typography variant="h4" color="#ff9800" sx={{ fontWeight: 700, mb: 1 }}>
            {stats.satisfaction_rating}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            od 5 zvjezdica
          </Typography>
        </CardContent>
      </StatsCard>
    </Box>
  )
}
