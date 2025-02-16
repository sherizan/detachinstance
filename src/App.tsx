import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { AddProduct } from './pages/AddProduct'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/add"
          element={
            <Layout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
              <AddProduct />
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
