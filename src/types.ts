export interface Product {
  id: number
  name: string
  url: string
  description: string
  logoUrl: string
  videoUrl: string
  votes: number
  category: string
}

export interface WebsiteMetadata {
  name: string
  description: string
  logo: string
  video?: string
  images: string[]
} 