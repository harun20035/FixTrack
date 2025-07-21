import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Avatar from "@mui/material/Avatar"
import { styled } from "@mui/material/styles"

const RecentCard = styled(Card)(({ theme }) => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  marginBottom: theme.spacing(2),
  "&:hover": {
    borderColor: "#42a5f5",
  },
}))

interface Report {
  id: number
  title: string
  status: string
  date: string
  priority: string
  assignee: string
}

type StatusColor = "success" | "primary" | "warning" | "default"
type PriorityColor = "error" | "warning" | "success" | "default"

export default function RecentReports() {
  const recentReports: Report[] = [
    {
      id: 1,
      title: "Kvar na slavini u kupatilu",
      status: "U toku",
      date: "15.01.2025",
      priority: "Visok",
      assignee: "Marko Petrović",
    },
    {
      id: 2,
      title: "Problem sa grijanjem",
      status: "Čeka dijelove",
      date: "12.01.2025",
      priority: "Srednji",
      assignee: "Ana Jovanović",
    },
    {
      id: 3,
      title: "Kvar na liftu",
      status: "Završeno",
      date: "08.01.2025",
      priority: "Visok",
      assignee: "Stefan Nikolić",
    },
  ]

  const getStatusColor = (status: string): StatusColor => {
    switch (status) {
      case "Završeno":
        return "success"
      case "U toku":
        return "primary"
      case "Čeka dijelove":
        return "warning"
      default:
        return "default"
    }
  }

  const getPriorityColor = (priority: string): PriorityColor => {
    switch (priority) {
      case "Visok":
        return "error"
      case "Srednji":
        return "warning"
      case "Nizak":
        return "success"
      default:
        return "default"
    }
  }

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Nedavne Prijave
      </Typography>
      {recentReports.map((report) => (
        <RecentCard key={report.id}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                {report.title}
              </Typography>
              <Chip label={report.status} color={getStatusColor(report.status)} size="small" variant="outlined" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Datum: {report.date}
              </Typography>
              <Chip label={report.priority} color={getPriorityColor(report.priority)} size="small" variant="filled" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: "#42a5f5", fontSize: "0.8rem" }}>
                {report.assignee.charAt(0)}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Izvođač: {report.assignee}
              </Typography>
            </Box>
          </CardContent>
        </RecentCard>
      ))}
    </Box>
  )
}
