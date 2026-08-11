import { redirect } from 'next/navigation'
import { createServerClientComponent } from '@/lib/supabase/server'

export async function requireAuth() {
  const supabase = createServerClientComponent()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return user
}

export async function requireActiveSubscription(tierId: string) {
  const supabase = createServerClientComponent()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect(`/login?redirect=/course/${tierId}`)
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('tier_id', tierId)
    .eq('status', 'active')
    .single()

  if (!subscription) {
    redirect(`/checkout/${tierId}`)
  }

  return subscription
}
