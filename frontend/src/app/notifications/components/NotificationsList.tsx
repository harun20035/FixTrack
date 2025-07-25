"use client"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import NotificationCard from "./NotificationCard"
import type { Notification } from "../types"

interface NotificationsListProps {
  notifications: Notification[]
  loading: boolean
  error: string
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
}

export default function NotificationsList({ notifications, loading, error, setNotifications }: NotificationsListProps) {
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await import("../../../utils/authFetch").then(({ authFetch }) =>
        authFetch(`http://localhost:8000/api/notifications/${notificationId}/read`, { method: "PATCH" })
      )
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      )
    } catch (e) {
      console.error(e);
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.isRead)
  const readNotifications = notifications.filter((n) => n.isRead)

  if (loading) {
    return <Typography color="primary">Učitavanje notifikacija...</Typography>
  }
  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Box>
      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Nepročitano ({unreadNotifications.length})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {unreadNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
            ))}
          </Box>
        </Box>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Pročitano ({readNotifications.length})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {readNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
            ))}
          </Box>
        </Box>
      )}

      {/* Empty State */}
      {notifications.length === 0 && !loading && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Nema notifikacija
          </Typography>
          <Typography variant="body2">Ovdje će se pojaviti notifikacije o promjenama statusa vaših prijava.</Typography>
        </Box>
      )}
    </Box>
  )
}
