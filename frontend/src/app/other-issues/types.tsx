export interface FilterOptions {
  searchTerm: string
  dateFrom: string
  dateTo: string
  location: string
}

export interface Issue {
  id: number
  title: string
  description: string | null
  location: string | null
  status: string
  created_at: string
  tenant: {
    id: number
    full_name: string
    email: string
    phone: string
    address: string
  } | null
  category: {
    id: number
    name: string
  } | null
  images: Array<{
    id: number
    image_url: string
  }>
}
