import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { getCityConfig } from '@/config/cities'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const city = getCityConfig()
  const baseUrl = `https://${city.domain}`

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: places } = await supabase
    .from('places')
    .select('id, updated_at')
    .eq('city_id', city.id)
    .eq('status', 'approved')

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
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  return staticPages
}
