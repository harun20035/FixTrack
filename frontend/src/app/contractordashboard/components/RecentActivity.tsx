import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Avatar from "@mui/material/Avatar"
import { styled } from "@mui/material/styles"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import BuildIcon from "@mui/icons-material/Build"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { ContractorActivity } from "../../../utils/dashboardApi"

const ActivityCard = styled(Card)(({ theme }) => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  marginBottom: theme.spacing(2),
  "&:hover": {
    borderColor: "#42a5f5",
  },
}))

interface RecentActivityProps {
  recentActivities: ContractorActivity[]
}

export default function RecentActivity({ recentActivities }: RecentActivityProps) {

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completed":
        return <CheckCircleIcon sx={{ color: "#4caf50" }} />
      case "started":
        return <BuildIcon sx={{ color: "#42a5f5" }} />
      case "arrived":
        return <LocationOnIcon sx={{ color: "#ff9800" }} />
      default:
        return <BuildIcon sx={{ color: "#42a5f5" }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Završeno":
        return "success"
      case "Popravka u toku":
        return "primary"
      case "Na lokaciji":
        return "warning"
      default:
        return "default"
    }
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Prije manje od sat vremena"
    } else if (diffInHours < 24) {
      return `Prije ${diffInHours} ${diffInHours === 1 ? "sat" : diffInHours < 5 ? "sata" : "sati"}`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `Prije ${diffInDays} ${diffInDays === 1 ? "dan" : diffInDays < 5 ? "dana" : "dana"}`
    }
  }

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Nedavna Aktivnost
      </Typography>

      {recentActivities.map((activity) => (
        <ActivityCard key={activity.id}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Avatar sx={{ bgcolor: "transparent", width: 40, height: 40 }}>{getActivityIcon(activity.type)}</Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {activity.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.5 }}>
                  {activity.description}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(activity.timestamp)}
                  </Typography>
                  {activity.status && (
                    <Chip
                      label={activity.status}
                      color={getStatusColor(activity.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </ActivityCard>
      ))}

    </Box>
  )
}
