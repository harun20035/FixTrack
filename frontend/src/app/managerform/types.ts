export interface ManagerFormData {
  motivationLetter: string
  managementExperience: string
  buildingManagementPlans: string
  experienceFile: File | null
  acceptTerms: boolean
  acceptRoleChange: boolean
}

export interface FormErrors {
  motivationLetter?: string
  managementExperience?: string
  buildingManagementPlans?: string
  experienceFile?: string
  acceptTerms?: string
  acceptRoleChange?: string
}

export interface ManagerApplication {
  id: number
  userId: number
  motivationLetter: string
  managementExperience: string
  buildingManagementPlans: string
  experienceFileUrl: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: number
  reviewNotes?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}
