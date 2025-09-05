import { authFetch } from './authFetch'
import type { RoleRequest, User, SystemSettings } from '../app/admin/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ===== ROLE REQUESTS API =====

export async function getRoleRequests(status?: string): Promise<RoleRequest[]> {
  const url = status 
    ? `${API_BASE}/api/admin/role-requests?status=${status}`
    : `${API_BASE}/api/admin/role-requests`
  
  const response = await authFetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch role requests')
  }
  return response.json()
}

export async function updateRoleRequest(
  requestId: number, 
  status: 'approved' | 'rejected', 
  adminNotes?: string
): Promise<RoleRequest> {
  const response = await authFetch(`${API_BASE}/api/admin/role-requests/${requestId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
      admin_notes: adminNotes
    })
  })
  
  if (!response.ok) {
    throw new Error('Failed to update role request')
  }
  return response.json()
}

export async function createRoleRequest(
  requestedRoleId: number,
  motivation: string
): Promise<RoleRequest> {
  const response = await authFetch(`${API_BASE}/api/role-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requested_role_id: requestedRoleId,
      motivation
    })
  })
  
  if (!response.ok) {
    throw new Error('Failed to create role request')
  }
  return response.json()
}

export async function getMyRoleRequests(): Promise<RoleRequest[]> {
  const response = await authFetch(`${API_BASE}/api/role-requests/my`)
  if (!response.ok) {
    throw new Error('Failed to fetch my role requests')
  }
  return response.json()
}

// ===== USER MANAGEMENT API =====

export async function getUsers(search?: string, roleId?: number): Promise<User[]> {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (roleId) params.append('role_id', roleId.toString())
  
  const url = `${API_BASE}/api/admin/users${params.toString() ? '?' + params.toString() : ''}`
  const response = await authFetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

export async function getUser(userId: number): Promise<User> {
  const response = await authFetch(`${API_BASE}/api/admin/users/${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.json()
}

export async function updateUser(userId: number, userData: Partial<User>): Promise<User> {
  const response = await authFetch(`${API_BASE}/api/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  })
  
  if (!response.ok) {
    throw new Error('Failed to update user')
  }
  return response.json()
}

export async function deleteUser(userId: number): Promise<void> {
  const response = await authFetch(`${API_BASE}/api/admin/users/${userId}`, {
    method: 'DELETE'
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete user')
  }
}

// ===== SYSTEM SETTINGS API =====

export async function getSystemSettings(): Promise<SystemSettings> {
  const response = await authFetch(`${API_BASE}/api/admin/settings`)
  if (!response.ok) {
    throw new Error('Failed to fetch system settings')
  }
  return response.json()
}

export async function updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
  const response = await authFetch(`${API_BASE}/api/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings)
  })
  
  if (!response.ok) {
    throw new Error('Failed to update system settings')
  }
  return response.json()
}

// ===== ROLES API =====

export interface Role {
  id: number
  name: string
  description?: string
}

export async function getRoles(): Promise<Role[]> {
  const response = await authFetch(`${API_BASE}/api/admin/roles`)
  if (!response.ok) {
    throw new Error('Failed to fetch roles')
  }
  return response.json()
}

export async function createRole(name: string, description?: string): Promise<Role> {
  const response = await authFetch(`${API_BASE}/api/admin/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description })
  })
  
  if (!response.ok) {
    throw new Error('Failed to create role')
  }
  return response.json()
}

export async function updateRole(roleId: number, name?: string, description?: string): Promise<Role> {
  const response = await authFetch(`${API_BASE}/api/admin/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description })
  })
  
  if (!response.ok) {
    throw new Error('Failed to update role')
  }
  return response.json()
}

export async function deleteRole(roleId: number): Promise<void> {
  const response = await authFetch(`${API_BASE}/api/admin/roles/${roleId}`, {
    method: 'DELETE'
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete role')
  }
}
