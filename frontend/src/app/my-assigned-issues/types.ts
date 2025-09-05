export interface FilterState {
  search: string
  dateFrom: string
  dateTo: string
  category: string
  priority: string
  status: string
}

export interface Tenant {
  id: number
  full_name: string
  email: string
  phone?: string
  address?: string
}

export interface IssueCategory {
  id: number
  name: string
}

export interface Issue {
  id: number
  title: string
  description?: string
  location?: string
  status: string
  created_at: string
  tenant: Tenant
  category: IssueCategory
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
  tenant: Tenant
}
