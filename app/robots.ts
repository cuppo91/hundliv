import { MetadataRoute } from 'next'
import { getCityConfig } from '@/config/cities'

export default function robots(): MetadataRoute.Robots {
  const city = getCityConfig()
  const baseUrl = `https://${city.domain}`

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
