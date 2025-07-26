export interface Issue {
  id: string
  title: string
  description: string
  category: "voda" | "struja" | "grijanje" | "ostalo"
  priority: "visok" | "srednji" | "nizak"
  status: "primljeno" | "u_toku" | "završeno" | "odbačeno"
  createdAt: string
  tenant: {
    name: string
    apartment: string
    phone: string
  }
  location: string
  images: string[]
  contractor?: {
    name: string
    phone: string
    specialization: string
  }
  notes?: string[]
  updatedAt?: string
  completedAt?: string
}

export interface FilterOptions {
  searchTerm: string
  dateFrom: string
  dateTo: string
  category: "all" | "voda" | "struja" | "grijanje" | "ostalo"
  priority: "all" | "visok" | "srednji" | "nizak"
}
