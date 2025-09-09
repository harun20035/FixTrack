"use client"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import AssignmentNotificationCard from "./AssignmentNotificationCard"
import type { AssignmentNotification } from "../types"

interface AssignmentNotificationsListProps {
  notifications: AssignmentNotification[]
  loading: boolean
  error: string
  setNotifications: React.Dispatch<React.SetStateAction<AssignmentNotification[]>>
}

export default function AssignmentNotificationsList({ notifications, loading, error, setNotifications }: AssignmentNotificationsListProps) {
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await import("../../../utils/authFetch").then(({ authFetch }) =>
        authFetch(`http://localhost:8000/api/contractor/assignment-notifications/${notificationId}/read`, { method: "PATCH" })
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
              <AssignmentNotificationCard key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
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
              <AssignmentNotificationCard key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
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
            Nema notifikacija o zadacima
          </Typography>
          <Typography variant="body2">Ovdje će se pojaviti notifikacije kada dobijete nove zadatke od upravnika.</Typography>
        </Box>
      )}
    </Box>
  )
}
