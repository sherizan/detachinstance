import { useState, useEffect, useRef } from 'react'
import './index.css'
import gsap from 'gsap'

// Add interface for Product type
interface Product {
  id: number
  name: string
  url: string
  description: string
  logoUrl: string
  videoUrl: string
  votes: number
  category: string
}

function App() {
  // Add state for products
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "UIzard",
      url: "uizard.io",
      description: "Visualize product ideas fast and easy with AI",
      logoUrl: "/path-to-uizard-logo.png", // Add actual logo path
      videoUrl: "https://uizard.io/static/videos/videos/fb3a6047985e855838a36fce78f71a0c02111333-c2af3e52f0036773a9bf55399cb59647-8a189d40981a87d4cddb16e72be7a423-vp9.webm", // Add actual video path
      votes: 0,
      category: "UI Design & Prototyping"
    },
    {
      id: 2,
      name: "UI2Code.ai",
      url: "ui2code.ai",
      description: "Transform any UI design into clean, production-ready code using advanced AI technology",
      logoUrl: "/path-to-ui2code-logo.png",
      videoUrl: "https://www.ui2code.ai/video.mp4",
      votes: 0,
      category: "Design to Code"
    },
    {
      id: 3,
      name: "Framer",
      url: "framer.com",
      description: "The website builder loved by designers.",
      logoUrl: "/path-to-visme-logo.png",
      videoUrl: "https://framerusercontent.com/assets/QqaG0gm3jF8RsKLEA7ZoF6via3w.mp4",
      votes: 0,
      category: "Visual Content Creation"
    },
    {
      id: 4,
      name: "uicopy",
      url: "uicopy.vercel.app",
      description: "Streamline your microcopy translations with AI",
      logoUrl: "/path-to-code2figma-logo.png",
      videoUrl: "https://uicopy.vercel.app/uicopy-demo.mp4",
      votes: 0,
      category: "UX Writing"
    },
    {
      id: 5,
      name: "Canva Magic Design",
      url: "canva.com/magic-design",
      description: "Transform your ideas into stunning designs instantly with AI-powered design generation and customization",
      logoUrl: "/path-to-canva-logo.png",
      videoUrl: "https://content-management-files.canva.com/assets/en/db5e9b76-2332-4daa-a753-1da1dae0ef00",
      votes: 0,
      category: "AI Design Generation"
    },
    {
      id: 6,
      name: "DesignQA",
      url: "designqa.com",
      description: "One click to turn design bugs into fixes",
      logoUrl: "/path-to-canva-logo.png",
      videoUrl: "https://designqa.com/videos/hero-video-short.mp4",
      votes: 0,
      category: "AI Design Generation"
    }
  ])
 
  const [isGridView, setIsGridView] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))]

  // Filter products based on active category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory)

  // Add loading state
  const [isLoading, setIsLoading] = useState(true)

  // Refs for animations
  const productsRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Add theme state
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Add these new refs at the top of your component
  const detachRef = useRef<HTMLSpanElement>(null)
  const instanceRef = useRef<HTMLSpanElement>(null)

  // Add theme toggle effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Initialize GSAP animations
  useEffect(() => {
    // Set initial opacity to 0 for elements we want to animate
    gsap.set([headerRef.current, categoriesRef.current, ".product-card"], {
      opacity: 0,
      y: 20
    })

    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Run animations after loading is complete
  useEffect(() => {
    if (!isLoading) {
      const tl = gsap.timeline({
        defaults: { 
          ease: "power3.out",
          duration: 0.8
        }
      })

      tl.to(headerRef.current, {
        y: 0,
        opacity: 1,
      })
      .to(categoriesRef.current, {
        y: 0,
        opacity: 1,
      }, "-=0.5")
      .to(".product-card", {
        y: 0,
        opacity: 1,
        stagger: 0.1
      }, "-=0.5")
    }
  }, [isLoading])

  // Animation for view toggle
  useEffect(() => {
    gsap.to(productsRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.to(productsRef.current, {
          opacity: 1,
          duration: 0.3,
          stagger: 0.1
        })
      }
    })
  }, [isGridView])

  // Animation for category filter
  useEffect(() => {
    gsap.from(".product-card", {
      scale: 0.95,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power3.out"
    })
  }, [activeCategory])

  // Mobile menu animation
  useEffect(() => {
    if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        height: isMobileMenuOpen ? 'auto' : 0,
        duration: 0.3,
        ease: "power2.inOut",
        onStart: () => {
          if (isMobileMenuOpen) {
            mobileMenuRef.current!.style.display = 'block'
          }
        },
        onComplete: () => {
          if (!isMobileMenuOpen) {
            mobileMenuRef.current!.style.display = 'none'
          }
        }
      })
    }
  }, [isMobileMenuOpen])

  // Update the handleVote function to only allow upvotes
  const handleVote = (productId: number, voteType: 'up' | 'down') => {
    // Only process upvotes
    if (voteType === 'up') {
      setProducts(products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            votes: product.votes + 1
          }
        }
        return product
      }))

      // Animate the vote counter
      gsap.from(`#vote-count-${productId}`, {
        scale: 1.5,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)"
      })
    }
  }

  // Button hover animation
  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean) => {
    gsap.to(e.currentTarget, {
      scale: isEnter ? 1.05 : 1,
      duration: 0.2,
      ease: "power2.out"
    })
  }

  // Update the shy button animation with larger movement range
  const handleShyButton = (e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean) => {
    if (isEnter) {
      gsap.to(e.currentTarget, {
        x: Math.random() * 200 - 100, // Increased from 100 to 200 (range: -100 to +100)
        y: Math.random() * 200 - 100, // Increased from 100 to 200 (range: -100 to +100)
        duration: 0.2, // Slightly faster to make it more elusive
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

  // Add this new function for the header text animation
  const handleHeaderHover = (isEnter: boolean) => {
    if (isEnter) {
      gsap.to(detachRef.current, {
        filter: 'blur(2px)',
        opacity: 0.7,
        duration: 0.3,
        ease: "power2.out"
      })
      gsap.to(instanceRef.current, {
        x: 10,
        duration: 0.3,
        ease: "power2.out"
      })
    } else {
      gsap.to(detachRef.current, {
        filter: 'blur(0px)',
        opacity: 1,
        duration: 0.3,
        ease: "power2.in"
      })
      gsap.to(instanceRef.current, {
        x: 0,
        duration: 0.3,
        ease: "power2.in"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Add visibility classes based on loading state */}
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <header ref={headerRef} className="bg-white dark:bg-transparent text-gray-900 dark:text-white p-6 transition-colors duration-200">
          <nav className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 
              className="text-2xl font-bold cursor-pointer"
              onMouseEnter={() => handleHeaderHover(true)}
              onMouseLeave={() => handleHeaderHover(false)}
            >
              <span ref={detachRef} className="inline-block">Detach</span>{' '}
              <span ref={instanceRef} className="inline-block">Instance</span>
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>
          </nav>
        </header>

        <main>
          {/* <section ref={introRef} className="max-w-6xl mx-auto px-6 py-20 text-center">
            <div className="intro-content space-y-6">
              <h2 className="text-5xl font-bold text-white mb-6">
                The Hugging Face of UX Design
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Your AI-powered design companion for the complete UX/UI workflow.
                From research to prototyping, we've got you covered.
              </p>
              <div className="flex gap-4 justify-center mt-10">
                <button 
                  className="btn-primary px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleButtonClick}
                >
                  Try Demo
                </button>
                <button 
                  className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          </section> */}

          <section className="max-w-6xl mx-auto px-6 py-2">
            {/* Category Navigation - Desktop */}
            <div className="hidden md:block">
              <div ref={categoriesRef} className="mb-8 border-b border-gray-700">
                <div className="flex flex-wrap gap-2 mb-[-1px]">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      onMouseEnter={(e) => handleButtonHover(e, true)}
                      onMouseLeave={(e) => handleButtonHover(e, false)}
                      className={`px-4 py-2 text-sm font-medium transition-colors
                        ${activeCategory === category
                          ? 'text-blue-400 border-b-2 border-blue-400'
                          : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Navigation - Mobile */}
            <div className="md:hidden mb-8">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg flex items-center justify-between text-white"
              >
                <span className="text-sm font-medium">
                  {activeCategory === 'all' ? 'All Categories' : activeCategory}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {/* Mobile Menu Dropdown */}
              <div
                ref={mobileMenuRef}
                className="hidden overflow-hidden bg-gray-800 rounded-lg mt-2"
              >
                <div className="p-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-medium rounded-lg transition-colors
                        ${activeCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Header with view toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Featured</h2>
                <span className="text-gray-400 text-sm">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </span>
              </div>
              <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
                {/* View Toggle Buttons */}
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    !isGridView ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    isGridView ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            <div ref={productsRef} className={`${isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'}`}>
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  className="product-card bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                >
                  {isGridView ? (
                    // Grid View Layout
                    <div className="flex flex-col h-full">
                      <div className="p-4">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={product.logoUrl} 
                              alt={`${product.name} logo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {product.name}
                            </h3>
                            <a 
                              href={`https://${product.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              {product.url}
                            </a>
                          </div>
                        </div>
                        <span className="inline-block px-3 py-1 text-sm bg-blue-100 dark:bg-blue-500 text-blue-800 dark:text-white rounded-full mb-3">
                          {product.category}
                        </span>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          {product.description}
                        </p>
                      </div>
                      <div className="mt-auto">
                        <div className="aspect-video bg-gray-900">
                          <video 
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster={product.logoUrl}
                          >
                            <source src={product.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <div className="p-3 bg-gray-900 flex items-center justify-end space-x-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleVote(product.id, 'up')}
                              className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <span id={`vote-count-${product.id}`} className="text-white font-bold text-sm">
                              {product.votes}
                            </span>
                            {/* Grid View Downvote Button */}
                            <button 
                              onMouseEnter={(e) => handleShyButton(e, true)}
                              onMouseLeave={(e) => handleShyButton(e, false)}
                              className="p-1 rounded-lg hover:bg-gray-700 transition-colors relative cursor-not-allowed opacity-50"
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
                    </div>
                  ) : (
                    // List View Layout (existing layout)
                    <>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Logo and Basic Info */}
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={product.logoUrl} 
                              alt={`${product.name} logo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {product.name}
                            </h3>
                            <a 
                              href={`https://${product.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              {product.url}
                            </a>
                            <div className="mt-2">
                              <span className="inline-block px-3 py-1 text-sm bg-blue-100 dark:bg-blue-500 text-blue-800 dark:text-white rounded-full">
                                {product.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                          <p className="text-gray-600 dark:text-gray-300">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      {/* Video Reel */}
                      <div className="w-full aspect-video bg-gray-900">
                        <video 
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          poster={product.logoUrl}
                        >
                          <source src={product.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>

                      {/* Voting Section */}
                      <div className="p-4 bg-gray-900 flex items-center justify-end space-x-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleVote(product.id, 'up')}
                            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <svg 
                              className="w-6 h-6 text-green-500" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M5 15l7-7 7 7" 
                              />
                            </svg>
                          </button>
                          <span id={`vote-count-${product.id}`} className="text-white font-bold">
                            {product.votes}
                          </span>
                          {/* List View Downvote Button */}
                          <button 
                            onMouseEnter={(e) => handleShyButton(e, true)}
                            onMouseLeave={(e) => handleShyButton(e, false)}
                            className="p-2 rounded-lg hover:bg-gray-700 transition-colors relative cursor-not-allowed opacity-50"
                            style={{ willChange: 'transform' }}
                            title="Downvoting is disabled"
                          >
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Show message when no products match the filter */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 animate-fadeIn">
                <p className="text-gray-400 text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
          </section>

          <section className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-bold text-white mb-8">Get Started Today</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of designers who are already using Detach Instance to streamline their UX/UI workflow.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Free Trial
            </button>
          </section>
        </main>
      </div>

      {/* Optional loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-500"></div>
        </div>
      )}

      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6 text-center">
        <p>© 2024 Detach Instance. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
