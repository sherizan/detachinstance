import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import gsap from 'gsap'

interface LayoutProps {
  children: ReactNode
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
}

export function Layout({ children, isDarkMode, setIsDarkMode }: LayoutProps) {
  const navigate = useNavigate()
  const headerRef = useRef<HTMLElement>(null)
  const detachRef = useRef<HTMLSpanElement>(null)
  const instanceRef = useRef<HTMLSpanElement>(null)

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
      <header ref={headerRef} className="bg-white dark:bg-transparent text-gray-900 dark:text-white p-6 transition-colors duration-200">
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 
            className="text-2xl font-bold cursor-pointer"
            onMouseEnter={() => handleHeaderHover(true)}
            onMouseLeave={() => handleHeaderHover(false)}
            onClick={() => navigate('/')}
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
            <button
              onClick={() => navigate('/add')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Add Product"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main>
        {children}
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">
                <span className="inline-block">Detach</span>{' '}
                <span className="inline-block">Instance</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover and share the best AI design tools
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://twitter.com/detachinstance" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a 
                  href="https://github.com/detachinstance" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Categories Column */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/?category=ui-design" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    UI Design & Prototyping
                  </a>
                </li>
                <li>
                  <a href="/?category=design-to-code" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Design to Code
                  </a>
                </li>
                <li>
                  <a href="/?category=visual-content" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Visual Content Creation
                  </a>
                </li>
                <li>
                  <a href="/?category=ai-design" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    AI Design Generation
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => navigate('/add')}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Add a Product
                  </button>
                </li>
                <li>
                  <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/newsletter" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Stay Updated</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get the latest AI design tools in your inbox
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>© 2024 Detach Instance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}