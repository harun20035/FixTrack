"use client"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import NotificationsLayout from "./components/NotificationsLayout"
import NotificationFilters from "./components/NotificationFilters"
import NotificationsList from "./components/NotificationsList"
import ProtectedRoute from "@/components/ProtectedRoute"
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
        (data as unknown as Array<Record<string, unknown>>).map((n) => {
          // Provjeri da li je napomena (ima message polje)
          if (n.message) {
            return {
              id: n.id as number,
              issueId: n.issue_id as number | undefined,
              issueTitle: n.issue_title as string | undefined,
              oldStatus: n.old_status as string | undefined,
              newStatus: n.new_status as string | undefined,
              changedBy: n.changed_by as string,
              changedAt: n.created_at as string,
              isRead: n.is_read as boolean,
              type: "note" as const,
              message: n.message as string,
            }
          } else {
            return {
          id: n.id as number,
              issueId: n.issue_id as number | undefined,
              issueTitle: n.issue_title as string | undefined,
              oldStatus: n.old_status as string | undefined,
              newStatus: n.new_status as string | undefined,
          changedBy: n.changed_by as string,
          changedAt: n.created_at as string,
          isRead: n.is_read as boolean,
              type: "status_change" as const,
            }
          }
        })
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
    <ProtectedRoute>
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
    </ProtectedRoute>
  )
}
