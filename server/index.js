const express = require('express')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const cors = require('cors')
const https = require('https')

const app = express()

// Enable CORS
app.use(cors())

// Create HTTPS agent to handle secure requests
const httpsAgent = new https.Agent({
  rejectUnauthorized: false // Be careful with this in production
})

app.get('/api/metadata', async (req, res) => {
  try {
    const { url } = req.query
    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    // Construct full URL if protocol is missing
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    
    console.log('Fetching metadata for:', fullUrl)

    const response = await fetch(fullUrl, {
      agent: httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 5000
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // More robust metadata extraction
    const metadata = {
      name: $('meta[property="og:title"]').attr('content') || 
            $('meta[name="twitter:title"]').attr('content') ||
            $('title').text().trim() ||
            url.split('.')[0],
            
      description: $('meta[property="og:description"]').attr('content') ||
                  $('meta[name="description"]').attr('content') ||
                  $('meta[name="twitter:description"]').attr('content') ||
                  '',

      logo: $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            $('link[rel="icon"]').attr('href') ||
            $('link[rel="shortcut icon"]').attr('href') ||
            `https://${url}/favicon.ico`,

      video: $('meta[property="og:video"]').attr('content') ||
             $('meta[property="og:video:url"]').attr('content') ||
             $('video source').attr('src') ||
             '',

      images: []
    }

    // Clean up URLs to ensure they're absolute
    const makeUrlAbsolute = (relativeUrl) => {
      if (!relativeUrl) return ''
      if (relativeUrl.startsWith('http')) return relativeUrl
      if (relativeUrl.startsWith('//')) return `https:${relativeUrl}`
      return new URL(relativeUrl, fullUrl).toString()
    }

    metadata.logo = makeUrlAbsolute(metadata.logo)
    metadata.video = makeUrlAbsolute(metadata.video)

    // Collect all images with absolute URLs
    $('img').each((i, el) => {
      const src = $(el).attr('src')
      if (src) {
        const absoluteUrl = makeUrlAbsolute(src)
        if (absoluteUrl && !metadata.images.includes(absoluteUrl)) {
          metadata.images.push(absoluteUrl)
        }
      }
    })

    // Clean up the data
    Object.keys(metadata).forEach(key => {
      if (typeof metadata[key] === 'string') {
        metadata[key] = metadata[key].trim()
      }
    })

    console.log('Successfully fetched metadata:', metadata)
    res.json(metadata)
  } catch (error) {
    console.error('Server error:', error.message)
    res.status(500).json({ 
      error: error.message,
      url: req.query.url,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Metadata server running on port ${PORT}`)
}) 