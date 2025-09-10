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
import AssignmentIcon from "@mui/icons-material/Assignment"
import LocationOnIcon from "@mui/icons-material/LocationOn"
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
  stats: ManagerStats | null
}

export default function SystemOverview({ stats }: SystemOverviewProps) {
  // Provjeri da li stats postoji
  if (!stats) {
    return null
  }

  // Izračunaj procenat završenih
  const completionRate = stats.total_issues > 0 ? Math.round((stats.completed_total / stats.total_issues) * 100) : 0

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Pregled Sistema
      </Typography>

      {/* Ukupna Performansa */}
      <OverviewCard>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <TrendingUpIcon sx={{ color: "#42a5f5" }} />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              Ukupna Performansa
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Završeno {stats.completed_total} od {stats.total_issues} prijava
          </Typography>
          <LinearProgress
            variant="determinate"
            value={completionRate}
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
            {completionRate}% završeno
          </Typography>
        </CardContent>
      </OverviewCard>

      {/* Trenutno Stanje */}
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
              <Chip label={stats.pending_assignment ?? 0} color="warning" size="small" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BuildIcon sx={{ fontSize: 20, color: "#f44336" }} />
                <Typography variant="body2">U toku</Typography>
              </Box>
              <Chip label={stats.in_progress ?? 0} color="error" size="small" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: "#4caf50" }} />
                <Typography variant="body2">Ukupno završeno</Typography>
              </Box>
              <Chip label={stats.completed_total ?? 0} color="success" size="small" />
            </Box>
          </Box>
        </CardContent>
      </OverviewCard>

      {/* Brze Statistike */}
      <OverviewCard>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
            Brze Statistike
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="#42a5f5" sx={{ fontWeight: 700 }}>
                {stats.total_issues ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ukupno prijava
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="#4caf50" sx={{ fontWeight: 700 }}>
                {completionRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Procenat završenih
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </OverviewCard>
    </Box>
  )
}
