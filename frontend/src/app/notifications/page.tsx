"use client"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import NotificationsLayout from "./components/NotificationsLayout"
import NotificationFilters from "./components/NotificationFilters"
import NotificationsList from "./components/NotificationsList"
import { useEffect, useState, useCallback } from "react"
import { authFetch } from "../../utils/authFetch"
import type { Notification } from "./types"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await authFetch("http://localhost:8000/api/notifications")
      if (!res.ok) throw new Error("Greška prilikom dohvata notifikacija.")
      const data = await res.json()
      setNotifications(
        (data as unknown as Array<Record<string, unknown>>).map((n) => ({
          id: n.id as number,
          issueId: n.issue_id as number,
          issueTitle: n.issue_title as string,
          oldStatus: n.old_status as string,
          newStatus: n.new_status as string,
          changedBy: n.changed_by as string,
          changedAt: n.created_at as string,
          isRead: n.is_read as boolean,
          type: "status_change",
        }))
      )
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAllAsRead = async () => {
    try {
      await authFetch("http://localhost:8000/api/notifications/read-all", { method: "PATCH" })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (e) {
        console.error(e);
    }
  }

  const counts = {
    all: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    read: notifications.filter((n) => n.isRead).length,
  }

  let filteredNotifications = notifications
  if (filter === "unread") filteredNotifications = notifications.filter((n) => !n.isRead)
  if (filter === "read") filteredNotifications = notifications.filter((n) => n.isRead)

  return (
    <NotificationsLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <NotificationFilters
            filter={filter}
            setFilter={setFilter}
            counts={counts}
            onMarkAllAsRead={handleMarkAllAsRead}
            loading={loading}
          />
          <NotificationsList
            notifications={filteredNotifications}
            loading={loading}
            error={error}
            setNotifications={setNotifications}
          />
        </Box>
      </Container>
    </NotificationsLayout>
  )
}
