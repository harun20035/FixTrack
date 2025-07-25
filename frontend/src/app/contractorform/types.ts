export interface ContractorFormData {
  motivationLetter: string
  reasonForBecomingContractor: string
  experienceFile: File | null
  acceptTerms: boolean
}

export interface FormErrors {
  motivationLetter?: string
  reasonForBecomingContractor?: string
  experienceFile?: string
  acceptTerms?: string
}

export interface ContractorApplication {
  id: number
  userId: number
  motivationLetter: string
  reasonForBecomingContractor: string
  experienceFileUrl?: string
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
