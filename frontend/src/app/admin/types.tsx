export interface RoleRequest {
  id: number
  user_id: number
  user_name: string
  user_email: string
  current_role_name: string
  requested_role_name: string
  created_at: string
  status: "pending" | "approved" | "rejected"
  motivation: string
  admin_notes?: string
  cv_file_url?: string
}

export interface User {
  id: number
  full_name: string
  email: string
  phone?: string
  address?: string
  role_id: number
  role_name: string
  created_at: string
}

export interface SystemSettings {
  id: number
  allow_registration: boolean
  require_approval: boolean
  email_notifications: boolean
  maintenance_mode: boolean
  auto_assignment: boolean
  created_at: string
  updated_at: string
}
