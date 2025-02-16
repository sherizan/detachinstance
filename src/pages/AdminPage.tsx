import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product, WebsiteMetadata } from '../types'

export function AdminPage() {
  const navigate = useNavigate()
  const [isMetadataLoading, setIsMetadataLoading] = useState(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'votes'>>({
    name: '',
    url: '',
    description: '',
    logoUrl: '',
    videoUrl: '',
    category: ''
  })

  const fetchMetadata = async (url: string) => {
    setIsMetadataLoading(true)
    try {
      const cleanUrl = url.replace(/^(https?:\/\/)/, '')
      
      const response = await fetch(`/api/metadata?url=${encodeURIComponent(cleanUrl)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: WebsiteMetadata = await response.json()
      
      setNewProduct(prev => ({
        ...prev,
        name: data.name || prev.name,
        description: data.description || prev.description,
        logoUrl: data.logo || prev.logoUrl,
        videoUrl: data.video || prev.videoUrl,
        url: cleanUrl
      }))
    } catch (error) {
      console.error('Error fetching metadata:', error)
    } finally {
      setIsMetadataLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Here you would typically make an API call to save the product
    // For now, we'll just navigate back
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product URL
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                required
                placeholder="example.com"
                value={newProduct.url}
                onChange={(e) => {
                  const url = e.target.value
                  setNewProduct({...newProduct, url})
                  if (url.includes('.')) {
                    const timer = setTimeout(() => fetchMetadata(url), 500)
                    return () => clearTimeout(timer)
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => fetchMetadata(newProduct.url)}
                disabled={isMetadataLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMetadataLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Fetch Info'
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  isMetadataLoading ? 'opacity-50' : ''
                }`}
                disabled={isMetadataLoading}
              />
              {isMetadataLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-pulse h-4 w-4 bg-blue-400 rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <div className="relative">
              <textarea
                required
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  isMetadataLoading ? 'opacity-50' : ''
                }`}
                rows={3}
                disabled={isMetadataLoading}
              />
              {isMetadataLoading && (
                <div className="absolute right-3 top-3">
                  <div className="animate-pulse h-4 w-4 bg-blue-400 rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Logo URL
            </label>
            <input
              type="url"
              required
              value={newProduct.logoUrl}
              onChange={(e) => setNewProduct({...newProduct, logoUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Video URL
            </label>
            <input
              type="url"
              required
              value={newProduct.videoUrl}
              onChange={(e) => setNewProduct({...newProduct, videoUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 