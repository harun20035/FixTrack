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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

const ActivityCard = styled(Card)(({ theme }) => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  marginBottom: theme.spacing(2),
  "&:hover": {
    borderColor: "#42a5f5",
  },
}))

interface Activity {
  id: number
  type: string
  title: string
  description: string
  timestamp: string
  status?: string
  amount?: number
}

export default function RecentActivity() {
  // Mock data
  const recentActivities: Activity[] = [
    {
      id: 1,
      type: "completed",
      title: "Popravka brave završena",
      description: "Uspješno popravljena brava na ulaznim vratima",
      timestamp: "2025-01-25T15:30:00Z",
      status: "Završeno",
      amount: 120,
    },
    {
      id: 2,
      type: "started",
      title: "Početa popravka grijanja",
      description: "Započeta popravka radijatora u stanu 22",
      timestamp: "2025-01-25T10:15:00Z",
      status: "U toku",
    },
    {
      id: 3,
      type: "arrived",
      title: "Stigao na lokaciju",
      description: "Stigao na adresu za popravku slavine",
      timestamp: "2025-01-25T08:45:00Z",
      status: "Na lokaciji",
    },
    {
      id: 4,
      type: "estimate",
      title: "Procjena troškova",
      description: "Poslana procjena za popravku elektroinstalacija",
      timestamp: "2025-01-24T16:20:00Z",
      amount: 180,
    },
    {
      id: 5,
      type: "completed",
      title: "Kvar riješen",
      description: "Uspješno riješen problem sa ventilacijom",
      timestamp: "2025-01-24T14:10:00Z",
      status: "Završeno",
      amount: 95,
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completed":
        return <CheckCircleIcon sx={{ color: "#4caf50" }} />
      case "started":
        return <BuildIcon sx={{ color: "#42a5f5" }} />
      case "arrived":
        return <LocationOnIcon sx={{ color: "#ff9800" }} />
      case "estimate":
        return <AttachMoneyIcon sx={{ color: "#ffc107" }} />
      default:
        return <BuildIcon sx={{ color: "#42a5f5" }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Završeno":
        return "success"
      case "U toku":
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
                  {activity.amount && (
                    <Chip
                      label={`${activity.amount} KM`}
                      size="small"
                      sx={{
                        backgroundColor: "#ffc107",
                        color: "#000",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </ActivityCard>
      ))}

      {/* View All Button */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: "#42a5f5",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Pogledaj svu aktivnost →
        </Typography>
      </Box>
    </Box>
  )
}
