import { MetadataRoute } from 'next'
import { getCityConfig } from '@/config/cities'
import { getArticlesForCity } from '@/lib/articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const city = getCityConfig()
  const baseUrl = `https://${city.domain}`
  const articles = getArticlesForCity(city.id)

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/restauranger`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/parker`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...articles.map(article => ({
      url: `${baseUrl}/guide/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return staticPages
}
