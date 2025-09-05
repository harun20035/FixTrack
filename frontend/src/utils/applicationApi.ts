import { authFetch } from './authFetch'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
console.log("API_BASE:", API_BASE)

export interface ContractorApplicationData {
  motivationLetter: string
  reasonForBecomingContractor: string
  experienceFile?: File
  acceptTerms: boolean
}

export interface ManagerApplicationData {
  motivationLetter: string
  managementExperience: string
  buildingManagementPlans: string
  experienceFile?: File
  acceptTerms: boolean
  acceptRoleChange: boolean
}

export interface ApplicationResponse {
  success: boolean
  message: string
  role_request_id?: number
  redirect_url?: string
}

export interface ApplicationStatus {
  has_pending_application: boolean
  application_type?: string
  status?: string
  submitted_at?: string
}

export async function submitContractorApplication(data: ContractorApplicationData): Promise<ApplicationResponse> {
  console.log("submitContractorApplication called with:", data)
  
  const formData = new FormData()
  
  formData.append('motivation_letter', data.motivationLetter)
  formData.append('reason_for_becoming_contractor', data.reasonForBecomingContractor)
  formData.append('accept_terms', data.acceptTerms.toString())
  
  if (data.experienceFile) {
    formData.append('experience_file', data.experienceFile)
  }
  
  console.log("Making request to:", `${API_BASE}/api/contractor-application`)
  
  const response = await authFetch(`${API_BASE}/api/contractor-application`, {
    method: 'POST',
    body: formData
  })
  
  console.log("Response status:", response.status)
  
  if (!response.ok) {
    const errorData = await response.json()
    console.log("Error response:", errorData)
    throw new Error(errorData.detail || 'Greška pri slanju aplikacije')
  }
  
  const result = await response.json()
  console.log("Success response:", result)
  return result
}

export async function submitManagerApplication(data: ManagerApplicationData): Promise<ApplicationResponse> {
  const formData = new FormData()
  
  formData.append('motivation_letter', data.motivationLetter)
  formData.append('management_experience', data.managementExperience)
  formData.append('building_management_plans', data.buildingManagementPlans)
  formData.append('accept_terms', data.acceptTerms.toString())
  formData.append('accept_role_change', data.acceptRoleChange.toString())
  
  if (data.experienceFile) {
    formData.append('experience_file', data.experienceFile)
  }
  
  const response = await authFetch(`${API_BASE}/api/manager-application`, {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || 'Greška pri slanju aplikacije')
  }
  
  return response.json()
}

export async function getApplicationStatus(): Promise<ApplicationStatus> {
  const response = await authFetch(`${API_BASE}/api/application-status`)
  
  if (!response.ok) {
    throw new Error('Greška pri dohvatanju statusa aplikacije')
  }
  
  return response.json()
}
