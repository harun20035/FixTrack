export interface HistoryIssue {
  id: number
  title: string
  description?: string
  location?: string
  status: string
  category: string | { id: number; name: string }
  createdAt: string
  completedAt?: string
  assignedTo?: string | { id: number; full_name?: string; name?: string } | null
  commentsCount: number
  rating?: number | null
}

export interface HistoryStats {
  totalIssues: number
  completedIssues: number
  rejectedIssues: number
  inProgressIssues: number
  averageResolutionTime: number
  averageRating: number
}

export interface FilterOptions {
  searchTerm: string
  category: string
  status: string
  dateFrom: string
  dateTo: string
  sortBy: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}
