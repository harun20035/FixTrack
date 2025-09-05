export interface FilterState {
  search: string
  dateFrom: string
  dateTo: string
  category: string
  priority: string
  status: string
}

export interface Tenant {
  name: string
  apartment: string
  phone: string
}

export interface Issue {
  id: string
  title: string
  description: string
  category: "voda" | "struja" | "grijanje" | "ostalo"
  priority: "visok" | "srednji" | "nizak"
  status: "dodijeljeno" | "u toku" | "čeka dijelove" | "završeno"
  tenant: Tenant
  location: string
  dateReported: string
  assignedTo: string
}
