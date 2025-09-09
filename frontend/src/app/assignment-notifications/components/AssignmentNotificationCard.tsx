"use client"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import { styled } from "@mui/material/styles"
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead"
import AssignmentIcon from "@mui/icons-material/Assignment"
import PersonIcon from "@mui/icons-material/Person"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CategoryIcon from "@mui/icons-material/Category"
import type { AssignmentNotification } from "../types"

const NotificationCardStyled = styled(Card)<{ isRead: boolean }>(({ theme, isRead }) => ({
  background: isRead ? "#2a2a2a" : "#1e3a5f",
  border: `1px solid ${isRead ? "#333" : "#42a5f5"}`,
  borderRadius: 12,
  transition: "all 0.3s ease",
  position: "relative",
  "&:hover": {
    borderColor: "#42a5f5",
    boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
  },
  "&::before": isRead
    ? {}
    : {
        content: '""',
        position: "absolute",
        top: 16,
        left: 16,
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "#42a5f5",
      },
}))

interface AssignmentNotificationCardProps {
  notification: AssignmentNotification
  onMarkAsRead: (notificationId: number) => void
}

export default function AssignmentNotificationCard({ notification, onMarkAsRead }: AssignmentNotificationCardProps) {
  const getPriorityColor = (priority: string): 'info' | 'secondary' | 'primary' | 'warning' | 'success' | 'error' | 'default' => {
    switch (priority) {
      case "visok":
        return "error"
      case "srednji":
        return "warning"
      case "nizak":
        return "success"
      default:
        return "default"
    }
  }

  const getCategoryColor = (category: string): 'info' | 'secondary' | 'primary' | 'warning' | 'success' | 'error' | 'default' => {
    switch (category) {
      case "voda":
        return "info"
      case "struja":
        return "warning"
      case "grijanje":
        return "error"
      case "ostalo":
        return "secondary"
      default:
        return "default"
    }
  }

  const formatDate = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
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

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id)
    }
  }

  const getNotificationTitle = () => {
    switch (notification.type) {
      case "new_assignment":
        return "Novi zadatak"
      case "assignment_update":
        return "Ažuriranje zadatka"
      case "assignment_cancelled":
        return "Otkazan zadatak"
      default:
        return "Notifikacija o zadatku"
    }
  }

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "new_assignment":
        return <AssignmentIcon sx={{ color: "#4caf50", fontSize: 20 }} />
      case "assignment_update":
        return <AssignmentIcon sx={{ color: "#ff9800", fontSize: 20 }} />
      case "assignment_cancelled":
        return <AssignmentIcon sx={{ color: "#f44336", fontSize: 20 }} />
      default:
        return <AssignmentIcon sx={{ color: "#42a5f5", fontSize: 20 }} />
    }
  }

  return (
    <NotificationCardStyled isRead={notification.isRead}>
      <CardContent sx={{ p: 3, pl: notification.isRead ? 3 : 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              {getNotificationIcon()}
              <Typography
                variant="h6"
                color="primary"
                sx={{
                  fontWeight: notification.isRead ? 500 : 600,
                  fontSize: "1.1rem",
                }}
              >
                {getNotificationTitle()}
              </Typography>
            </Box>
            
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                mb: 1,
                fontWeight: 600,
              }}
            >
              {notification.issueTitle}
            </Typography>

            {notification.issueDescription && (
              <Typography
                variant="body2"
                sx={{
                  color: "#b0b0b0",
                  mb: 2,
                }}
              >
                {notification.issueDescription}
              </Typography>
            )}

            {/* Chips for category and priority */}
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              {notification.category && (
                <Chip
                  icon={<CategoryIcon />}
                  label={notification.category}
                  size="small"
                  color={getCategoryColor(notification.category)}
                  sx={{ fontSize: "0.75rem" }}
                />
              )}
              {notification.priority && (
                <Chip
                  label={notification.priority.toUpperCase()}
                  size="small"
                  color={getPriorityColor(notification.priority)}
                  sx={{ fontSize: "0.75rem" }}
                />
              )}
            </Box>

            {/* Location */}
            {notification.issueLocation && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                <Typography variant="body2" color="text.secondary">
                  {notification.issueLocation}
                </Typography>
              </Box>
            )}

            {/* Custom message */}
            {notification.message && (
              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  mb: 2,
                  fontStyle: "italic",
                  backgroundColor: "rgba(66, 165, 245, 0.1)",
                  padding: 2,
                  borderRadius: 1,
                  border: "1px solid rgba(66, 165, 245, 0.2)",
                }}
              >
                "{notification.message}"
              </Typography>
            )}
          </Box>
          {!notification.isRead && (
            <IconButton
              size="small"
              onClick={handleMarkAsRead}
              sx={{
                color: "#42a5f5",
                "&:hover": {
                  backgroundColor: "rgba(66, 165, 245, 0.1)",
                },
              }}
            >
              <MarkEmailReadIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
              <Typography variant="body2" color="text.secondary">
                {notification.assignedBy}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
              <Typography variant="body2" color="text.secondary">
                {formatDate(notification.assignedAt)}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
            Assignment #{notification.assignmentId}
          </Typography>
        </Box>
      </CardContent>
    </NotificationCardStyled>
  )
}
