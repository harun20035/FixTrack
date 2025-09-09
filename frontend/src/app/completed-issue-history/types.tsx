export interface Tenant {
  name: string
  apartment: string
  phone: string
}

export interface CompletedIssue {
  id: string
  title: string
  description: string
  category: string
  priority: string
  tenant: Tenant | null
  location: string
  completed_at: string
  notes: string[]
  images: string[]
  warranty_pdf: string | null
}
