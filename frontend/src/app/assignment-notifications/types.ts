export interface AssignmentNotification {
  id: number
  assignmentId: number
  issueId: number
  issueTitle: string
  issueDescription?: string
  issueLocation?: string
  category?: string
  priority?: string
  assignedBy: string
  assignedAt: string
  isRead: boolean
  type: "new_assignment" | "assignment_update" | "assignment_cancelled"
  message?: string
}

export interface AssignmentNotificationCounts {
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
