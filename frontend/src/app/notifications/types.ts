export interface Notification {
  id: number
  issueId?: number
  issueTitle?: string
  oldStatus?: string
  newStatus?: string
  changedBy: string
  changedAt: string
  isRead: boolean
  type: "status_change" | "note"
  message?: string
}

export interface NotificationCounts {
  all: number
  unread: number
  read: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}
