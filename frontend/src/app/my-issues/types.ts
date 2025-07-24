export interface Issue {
  id: number;
  title: string;
  description?: string;
  location?: string;
  status: string;
  category: { name: string } | string;
  created_at: string;
  assignedTo?: string | null;
  images: (string | { image_url: string } | undefined)[];
}

export interface IssueCategory {
  id: number
  name: string
  description: string
}

export interface FilterOptions {
  searchTerm: string
  category: string
  status: string
}

export interface StatusCount {
  status: string
  count: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}
