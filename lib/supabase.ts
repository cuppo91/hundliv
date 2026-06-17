import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Place = {
  id: string
  city_id: string
  name: string
  category: 'restaurant' | 'cafe' | 'park' | 'activity' | 'shop' | 'vet'
  address: string
  lat: number
  lng: number
  description: string | null
  phone: string | null
  website: string | null
  google_place_id: string | null
  rating: number | null
  photo_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  submitted_by: string | null
  submission_note: string | null
  created_at: string
  updated_at: string
}
