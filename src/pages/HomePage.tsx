import { useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import type { Product, LoadingState, SortOption, Category } from '../types'
import { supabase } from '../lib/supabase'

export function HomePage() {
  const [isGridView, setIsGridView] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    hasMore: true,
    error: null
  })
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 6
  const [sortBy, setSortBy] = useState<SortOption>('votes')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [isCategoryLoading, setIsCategoryLoading] = useState(false)

  // Get filtered products
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category?.slug === activeCategory)

  const fetchProducts = useCallback(async (isLoadingMore = false) => {
    try {
      if (!isLoadingMore) {
        setLoadingState((prev: LoadingState) => ({ ...prev, isLoading: true }))
      }

      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `, { count: 'exact' })

      // Apply sorting
      if (sortBy === 'votes') {
        query = query.order('votes', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Apply category filter
      if (activeCategory !== 'all') {
        query = query.eq('categories.slug', activeCategory)
      }

      const { data, error, count } = await query.range(from, to)

      if (error) throw error
      
      if (data) {
        setProducts(prev => isLoadingMore ? [...prev, ...data] : data)
        setLoadingState((prev: LoadingState) => ({ 
          ...prev, 
          hasMore: count ? from + data.length < count : false
        }))
      }
    } catch (err) {
      setLoadingState((prev: LoadingState) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An error occurred'
      }))
      console.error('Error fetching products:', err)
    } finally {
      setLoadingState((prev: LoadingState) => ({ ...prev, isLoading: false }))
    }
  }, [page, sortBy, activeCategory])

  useEffect(() => {
    setPage(1)
    fetchProducts()
  }, [sortBy, fetchProducts])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (error) throw error
        
        if (data) {
          setCategories(data)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setLoadingState(prev => ({
          ...prev,
          error: 'Failed to load categories'
        }))
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
    fetchProducts(true)
  }

  const handleVote = async (productId: number, voteType: 'up' | 'down') => {
    if (voteType === 'up') {
      try {
        // Optimistic update
        setProducts(products.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              votes: product.votes + 1
            }
          }
          return product
        }))

        const { error } = await supabase
          .from('products')
          .update({ votes: products.find(p => p.id === productId)!.votes + 1 })
          .eq('id', productId)

        if (error) {
          // Revert optimistic update on error
          setProducts(products.map(product => {
            if (product.id === productId) {
              return {
                ...product,
                votes: product.votes - 1
              }
            }
            return product
          }))
          throw error
        }
      } catch (err) {
        setLoadingState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Error updating vote'
        }))
        console.error('Error updating vote:', err)
      }
    }
  }

  const handleShyButton = (e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean) => {
    if (isEnter) {
      gsap.to(e.currentTarget, {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        duration: 0.2,
        ease: "power1.out"
      })
    } else {
      gsap.to(e.currentTarget, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      })
    }
  }

  const handleCategoryChange = async (categorySlug: string) => {
    setActiveCategory(categorySlug)
    setIsCategoryLoading(true)
    setPage(1) // Reset to first page
    await fetchProducts()
    setIsCategoryLoading(false)
  }

  const renderCategoryNavigation = () => {
    if (categoriesLoading) {
      return (
        <div className="mb-8 border-b border-gray-300 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 mb-[-1px]">
            {[1, 2, 3, 4, 5].map((n) => (
              <div 
                key={n}
                className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="mb-8 border-b border-gray-300 dark:border-gray-700">
        <div className="flex flex-wrap gap-2 mb-[-1px]">
          <button
            onClick={() => handleCategoryChange('all')}
            disabled={isCategoryLoading}
            className={`px-4 py-2 text-sm font-medium transition-colors
              ${activeCategory === 'all'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              } ${isCategoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              disabled={isCategoryLoading}
              className={`px-4 py-2 text-sm font-medium transition-colors
                ${activeCategory === category.slug
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                } ${isCategoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-2">
      {loadingState.error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
          {loadingState.error}
        </div>
      )}

      {loadingState.isLoading && !products.length ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Category Navigation - Desktop */}
          <div className="hidden md:block">
            {renderCategoryNavigation()}
          </div>

          {/* Category Navigation - Mobile */}
          <div className="md:hidden mb-8">
            {categoriesLoading ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <select
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={isCategoryLoading}
                className={`w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 
                  ${isCategoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured</h2>
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700"
              >
                <option value="votes">Highest Votes</option>
                <option value="newest">Newest First</option>
              </select>

              {/* View Toggle */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-2 rounded transition-colors ${!isGridView 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-2 rounded transition-colors ${isGridView 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={`${isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'}`}>
            {isCategoryLoading ? (
              // Loading skeleton for products
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-pulse">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                    </div>
                  </div>
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                </div>
              ))
            ) : (
              filteredProducts.map(product => (
                <div 
                  key={product.id}
                  className="product-card bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                >
                  {/* Product Content */}
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={product.logo_url} 
                          alt={`${product.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
                        <a 
                          href={`https://${product.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                        >
                          {product.url}
                        </a>
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 text-sm bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-white rounded-full">
                            {product.category?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p 
                      className="text-gray-600 dark:text-gray-300 mt-4 min-h-20"
                    >
                      {product.description}
                    </p>
                  </div>

                  {/* Video */}
                  <div className="aspect-video bg-gray-100 dark:bg-gray-900">
                    <video 
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={product.logo_url}
                    >
                      <source src={product.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Voting */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-end space-x-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleVote(product.id, 'up')}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <span className="text-gray-900 dark:text-white font-bold">{product.votes}</span>
                      <button 
                        onMouseEnter={(e) => handleShyButton(e, true)}
                        onMouseLeave={(e) => handleShyButton(e, false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative cursor-not-allowed opacity-50"
                        style={{ willChange: 'transform' }}
                        title="Downvoting is disabled"
                      >
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Show More Button */}
          {loadingState.hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingState.isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loadingState.isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Loading more...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span>Show More</span>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
} 