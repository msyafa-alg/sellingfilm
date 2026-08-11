import { cookies } from 'next/headers'
import { createServerClientComponent } from '@/lib/supabase/server'

export async function getTier(tierId: string) {
  const supabase = await createServerClientComponent()
  
  const { data: tier, error } = await supabase
    .from('tiers')
    .select('*')
    .eq('id', tierId)
    .single()

  if (error) {
    return null
  }

  return tier
}

export async function getTiers() {
  const supabase = await createServerClientComponent()
  
  const { data: tiers, error } = await supabase
    .from('tiers')
    .select('*')
    .order('price', { ascending: true })

  if (error) {
    return []
  }

  return tiers
}

export async function getSubscription(userId: string) {
  const supabase = await createServerClientComponent()
  
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      tier:tier_id (*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (error) {
    return null
  }

  return subscription
}



