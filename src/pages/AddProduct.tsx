import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Product, Category } from '../types'

export function AddProduct() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'created_at' | 'votes' | 'category'>>({
    name: '',
    url: '',
    description: '',
    logo_url: '',
    video_url: '',
    category_id: 0
  })

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (error) throw error
        if (data) setCategories(data)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Validate category_id
      if (!newProduct.category_id) {
        throw new Error('Please select a category')
      }

      // Validate URL format
      if (!newProduct.url.match(/^[^/]+\.[^/]+$/)) {
        throw new Error('URL should be in format: domain.com')
      }

      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: newProduct.name,
            url: newProduct.url,
            description: newProduct.description,
            logo_url: newProduct.logo_url,
            video_url: newProduct.video_url,
            category_id: newProduct.category_id,
            votes: 0
          }
        ])

      if (error) throw error
      
      navigate('/')
    } catch (err) {
      console.error('Error adding product:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Product</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="off"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. UIzard"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product URL
            </label>
            <input
              id="url"
              name="url"
              type="text"
              required
              autoComplete="url"
              placeholder="e.g. uizard.io"
              value={newProduct.url}
              onChange={(e) => setNewProduct({...newProduct, url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              autoComplete="off"
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Describe what the product does..."
            />
          </div>

          <div>
            <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Logo URL
            </label>
            <input
              id="logo_url"
              name="logo_url"
              type="url"
              required
              autoComplete="url"
              value={newProduct.logo_url}
              onChange={(e) => setNewProduct({...newProduct, logo_url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Video URL
            </label>
            <input
              id="video_url"
              name="video_url"
              type="url"
              required
              autoComplete="url"
              value={newProduct.video_url}
              onChange={(e) => setNewProduct({...newProduct, video_url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="https://example.com/demo.mp4"
            />
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              autoComplete="off"
              value={newProduct.category_id || ''}
              onChange={(e) => setNewProduct({...newProduct, category_id: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 