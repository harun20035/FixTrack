import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import LinearProgress from "@mui/material/LinearProgress"
import Chip from "@mui/material/Chip"
import { styled } from "@mui/material/styles"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import PeopleIcon from "@mui/icons-material/People"
import BuildIcon from "@mui/icons-material/Build"
import HomeIcon from "@mui/icons-material/Home"
import PendingIcon from "@mui/icons-material/Pending"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { ManagerStats } from "../../../utils/dashboardApi"

const OverviewCard = styled(Card)(({ theme }) => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#42a5f5",
    boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
  },
}))

interface SystemOverviewProps {
  stats: ManagerStats
}

export default function SystemOverview({ stats }: SystemOverviewProps) {
  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Pregled Sistema
      </Typography>

      {/* Monthly Performance */}
      <OverviewCard>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <TrendingUpIcon sx={{ color: "#42a5f5" }} />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              Mjesečna Performansa
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Riješeno {stats.completed_this_month} od {stats.total_issues} prijava
          </Typography>
          <LinearProgress
            variant="determinate"
            value={stats.success_rate}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#333",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#4caf50",
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "right" }}>
            {stats.success_rate}% uspješnost
          </Typography>
        </CardContent>
      </OverviewCard>

      {/* Current Status Overview */}
      <OverviewCard>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
            Trenutno Stanje
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PendingIcon sx={{ fontSize: 20, color: "#ff9800" }} />
                <Typography variant="body2">Na čekanju</Typography>
              </Box>
              <Chip label={stats.pending_assignment} color="warning" size="small" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BuildIcon sx={{ fontSize: 20, color: "#f44336" }} />
                <Typography variant="body2">U toku</Typography>
              </Box>
              <Chip label={stats.in_progress} color="error" size="small" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: "#4caf50" }} />
                <Typography variant="body2">Završeno ovaj mjesec</Typography>
              </Box>
              <Chip label={stats.completed_this_month} color="success" size="small" />
            </Box>
          </Box>
        </CardContent>
      </OverviewCard>


      {/* Quick Stats */}
      <OverviewCard>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
            Brze Statistike
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="#4caf50" sx={{ fontWeight: 700 }}>
                {stats.average_resolution_time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prosječno vrijeme (dani)
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="#ff9800" sx={{ fontWeight: 700 }}>
                {stats.success_rate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Stopa uspješnosti
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </OverviewCard>
    </Box>
  )
}
