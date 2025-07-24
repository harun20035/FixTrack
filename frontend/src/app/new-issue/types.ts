export interface IssueFormData {
  title: string
  description: string
  location: string
  categoryId: string
  images: File[]
}

export interface FormErrors {
  title?: string
  description?: string
  location?: string
  categoryId?: string
  images?: string
}

export interface IssueCategory {
  id: number
  name: string
  description: string
}

export interface Issue {
  id: number
  tenantId: number
  categoryId: number
  title: string
  description?: string
  location?: string
  status: string
  createdAt: string
  updatedAt?: string
  tenant?: User
  category?: IssueCategory
  images?: IssueImage[]
}

export interface User {
  id: number
  fullName: string
  email: string
  role: string
}

export interface IssueImage {
  id: number
  issueId: number
  imageUrl: string
  fileName: string
  uploadedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}
