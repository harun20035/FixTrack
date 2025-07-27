export interface Tenant {
  id: number
  full_name: string
  email: string
  phone: string
  address: string
  role_id: number
  created_at: string
}

export interface AdminNote {
  id: number
  admin_id: number
  tenant_id: number
  note: string
  created_at: string
  admin?: {
    id: number
    full_name: string
  }
  tenant?: {
    id: number
    full_name: string
  }
}
