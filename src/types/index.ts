export interface Category {
  id: number
  name: string
  slug: string
  created_at: string
}

export interface Product {
  id: number
  created_at: string
  name: string
  url: string
  description: string
  logo_url: string
  video_url: string
  category_id: number
  votes: number
  category?: Category
}

export type SortOption = 'votes' | 'newest'

export interface LoadingState {
  isLoading: boolean
  hasMore: boolean
  error: string | null
}

// Types for form state
export type NewProduct = Omit<Product, 'id' | 'created_at' | 'votes' | 'category'> & {
  category_id: number
}

// Add pagination types
export interface PaginationState {
  page: number
  pageSize: number
  total: number
} 