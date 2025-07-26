export interface FilterState {
  search: string
  dateFrom: string
  dateTo: string
  category: string
  priority: string
  status: string
}

export interface Issue {
  id: string
  title: string
  description: string
  category: "voda" | "struja" | "grijanje" | "ostalo"
  priority: "visok" | "srednji" | "nizak"
  status: "u toku" | "završeno" | "na čekanju" | "otkazano"
  tenant: {
    name: string
    apartment: string
    phone: string
  }
  location: string
  dateReported: string
  contractor?: string
}
