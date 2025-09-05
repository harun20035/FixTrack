import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Avatar from "@mui/material/Avatar"
import { styled } from "@mui/material/styles"
import { RecentIssue } from "../../../utils/dashboardApi"

const RecentCard = styled(Card)(({ theme }) => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  marginBottom: theme.spacing(2),
  "&:hover": {
    borderColor: "#42a5f5",
  },
}))

type StatusColor = "success" | "primary" | "warning" | "default"
type PriorityColor = "error" | "warning" | "success" | "default"

interface RecentReportsProps {
  recentIssues: RecentIssue[]
}

export default function RecentReports({ recentIssues }: RecentReportsProps) {

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
      {recentIssues.map((report) => (
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
            {report.assignee && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: "#42a5f5", fontSize: "0.8rem" }}>
                  {report.assignee.charAt(0)}
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Izvođač: {report.assignee}
                </Typography>
              </Box>
            )}
          </CardContent>
        </RecentCard>
      ))}
    </Box>
  )
}
