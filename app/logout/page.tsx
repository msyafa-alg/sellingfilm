import { createServerClientComponent } from '@/lib/supabase/server'

export default async function LogoutPage() {
  const supabase = await createServerClientComponent()
  await supabase.auth.signOut()

  return null
}
