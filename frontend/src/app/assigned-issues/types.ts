export interface Tenant {
  id: number
  full_name: string
  email: string
  phone: string
  address: string
}

export interface Issue {
  id: number
  title: string
  description?: string
  location?: string
  status: string
  created_at: string
  updated_at: string
  category?: {
    id: number
    name: string
  }
  images: Array<{
    id: number
    image_url: string
  }>
}

export interface Assignment {
  id: number
  issue_id: number
  contractor_id: number
  status: string
  estimated_cost?: number
  actual_cost?: number
  planned_date?: string
  rejection_reason?: string
  notes?: string
  created_at: string
  updated_at: string
  issue: Issue
  tenant?: Tenant
}

export interface AssignmentImage {
  id: number
  assignment_id: number
  image_url: string
}

export interface AssignmentDocument {
  id: number
  assignment_id: number
  document_url: string
  type: string
}

export interface FilterOptions {
  searchTerm: string
  status: string
  dateFrom?: string
  dateTo?: string
}

export interface StatusCount {
  status: string
  count: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface StatusChangeRequest {
  status: string
  notes?: string
}

export interface RejectionRequest {
  rejection_reason: string
}

export interface CostUpdateRequest {
  actual_cost: number
}

export interface DocumentUploadRequest {
  file: File
  document_type: string
}
