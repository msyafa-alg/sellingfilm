# Logout Route

import { signOut } from '@/lib/supabase/actions'

export async function GET() {
  await signOut()
}
