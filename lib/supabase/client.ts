import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient<Database> | null = null

export function createClient(): SupabaseClient<Database> | null {
  if (typeof window === 'undefined') {
    return null
  }

  if (!cachedClient) {
    cachedClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return cachedClient
}
