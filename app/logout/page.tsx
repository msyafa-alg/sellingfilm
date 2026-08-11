import { signOut } from '@/lib/supabase/actions'

export default function LogoutPage() {
  'use server'
  signOut()
}
