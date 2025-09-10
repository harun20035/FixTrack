import { authFetch } from './authFetch'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Tenant Dashboard Types
export interface TenantStats {
  total_issues: number
  in_progress: number
  completed: number
  urgent: number
  monthly_goal_progress: number
  average_resolution_time: number
  satisfaction_rating: number
}

export interface RecentIssue {
  id: number
  title: string
  status: string
  date: string
  priority: string
  assignee?: string
}

export interface TenantDashboardData {
  stats: TenantStats
  recent_issues: RecentIssue[]
}

// Manager Dashboard Types
export interface ManagerStats {
  total_issues: number
  pending_assignment: number
  in_progress: number
  completed_total: number
}

export interface ManagerIssue {
  id: number
  title: string
  description: string
  location: string
  status: string
  tenant: string
  assigned_to?: string
  created_at: string
}

export interface ManagerDashboardData {
  stats: ManagerStats
  recent_issues: ManagerIssue[]
}

// Contractor Dashboard Types
export interface ContractorStats {
  assigned_issues: number
  on_location: number
  in_progress: number
  completed_total: number
}

export interface ContractorIssue {
  id: number
  title: string
  description: string
  location: string
  status: string
  assigned_at: string
  planned_date?: string
}

export interface ContractorActivity {
  id: number
  type: string
  title: string
  description: string
  timestamp: string
  status?: string
}

export interface ContractorDashboardData {
  stats: ContractorStats
  assigned_issues: ContractorIssue[]
  recent_activities: ContractorActivity[]
}

// API Functions
export const getTenantDashboard = async (): Promise<TenantDashboardData> => {
  const response = await authFetch(`${API_BASE}/api/tenant/dashboard`)
  
  if (!response.ok) {
    throw new Error('Greška pri dohvatanju tenant dashboard podataka')
  }
  
  return response.json()
}

export const getManagerDashboard = async (): Promise<ManagerDashboardData> => {
  const response = await authFetch(`${API_BASE}/api/manager/dashboard`)
  
  if (!response.ok) {
    throw new Error('Greška pri dohvatanju manager dashboard podataka')
  }
  
  return response.json()
}

export const getContractorDashboard = async (): Promise<ContractorDashboardData> => {
  const response = await authFetch(`${API_BASE}/api/contractor/dashboard`)
  
  if (!response.ok) {
    throw new Error('Greška pri dohvatanju contractor dashboard podataka')
  }
  
  return response.json()
}
