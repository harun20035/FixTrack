"use client"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import { styled } from "@mui/material/styles"
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import PersonIcon from "@mui/icons-material/Person"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import NoteIcon from "@mui/icons-material/Note"
import type { Notification } from "../types"

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

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (notificationId: number) => void
}

export default function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
  const getStatusColor = (status: string): 'info' | 'secondary' | 'primary' | 'warning' | 'success' | 'error' | 'default' => {
    switch (status) {
      case "Primljeno":
        return "info"
      case "Dodijeljeno":
        return "secondary"
      case "U toku":
        return "primary"
      case "Čeka dijelove":
        return "warning"
      case "Završeno":
        return "success"
      case "Otkazano":
        return "error"
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

  const isNote = notification.type === "note" || notification.message

  return (
    <NotificationCardStyled isRead={notification.isRead}>
      <CardContent sx={{ p: 3, pl: notification.isRead ? 3 : 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            {isNote ? (
              // Napomena
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <NoteIcon sx={{ color: "#42a5f5", fontSize: 20 }} />
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      fontWeight: notification.isRead ? 500 : 600,
                      fontSize: "1.1rem",
                    }}
                  >
                    Napomena od upravnika
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
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
              </>
            ) : (
              // Status promjena
              <>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: notification.isRead ? 500 : 600,
                mb: 1,
                fontSize: "1.1rem",
              }}
            >
              {notification.issueTitle}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Status promijenjen sa
              </Typography>
                  {notification.oldStatus && (
              <Chip label={notification.oldStatus} color={getStatusColor(notification.oldStatus)} size="small" />
                  )}
              <ArrowForwardIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  {notification.newStatus && (
              <Chip label={notification.newStatus} color={getStatusColor(notification.newStatus)} size="small" />
                  )}
            </Box>
              </>
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
                {notification.changedBy}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
              <Typography variant="body2" color="text.secondary">
                {formatDate(notification.changedAt)}
              </Typography>
            </Box>
          </Box>
          {!isNote && notification.issueId && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
            Issue #{notification.issueId}
          </Typography>
          )}
        </Box>
      </CardContent>
    </NotificationCardStyled>
  )
}
