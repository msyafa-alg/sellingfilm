import { createServerClientComponent } from '@/lib/supabase/server'

export default async function LogoutPage() {
  'use server'

  const supabase = createServerClientComponent()
  await supabase.auth.signOut()

  return null
}
