"use client"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import AssignmentNotificationsLayout from "./components/AssignmentNotificationsLayout"
import AssignmentNotificationFilters from "./components/AssignmentNotificationFilters"
import AssignmentNotificationsList from "./components/AssignmentNotificationsList"
import { useEffect, useState, useCallback } from "react"
import { authFetch } from "../../utils/authFetch"
import type { AssignmentNotification } from "./types"

export default function AssignmentNotificationsPage() {
  const [notifications, setNotifications] = useState<AssignmentNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await authFetch("http://localhost:8000/api/contractor/assignment-notifications")
      if (!res.ok) throw new Error("Greška prilikom dohvata notifikacija.")
      const data = await res.json()
      setNotifications(data || [])
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
      await authFetch("http://localhost:8000/api/contractor/assignment-notifications/read-all", { method: "PATCH" })
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
    <AssignmentNotificationsLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <AssignmentNotificationFilters
            filter={filter}
            setFilter={setFilter}
            counts={counts}
            onMarkAllAsRead={handleMarkAllAsRead}
            loading={loading}
          />
          <AssignmentNotificationsList
            notifications={filteredNotifications}
            loading={loading}
            error={error}
            setNotifications={setNotifications}
          />
        </Box>
      </Container>
    </AssignmentNotificationsLayout>
  )
}
