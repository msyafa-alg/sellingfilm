import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

let cachedClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (!cachedClient && typeof window !== 'undefined') {
    cachedClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return cachedClient
}