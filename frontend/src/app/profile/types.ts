export interface UserProfile {
  id: number
  roleId: number
  fullName: string
  email: string
  phone?: string
  address?: string
  createdAt: string
  role: {
    id: number
    name: string
  }
}

export interface ProfileFormData {
  fullName: string
  email: string
  phone: string
  address: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}
