import { signOut } from '@/lib/supabase/actions'

export default async function LogoutPage() {
  await signOut()
}
