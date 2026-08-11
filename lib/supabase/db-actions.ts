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

export async function createInvoice(
  user: { id: string; email: string; full_name: string },
  tier: { id: string; name: string; price: number }
) {
  'use server'

  const { PayGetClient } = await import('@/lib/payget/client')
  const payGet = new PayGetClient(process.env.PAYGET_API_KEY!)
  
  const supabase = await createServerClientComponent()

  const response = await payGet.createInvoice(tier.price)

  if (!response.success) {
    throw new Error('Failed to create invoice')
  }

  const { error: insertError } = await supabase
    .from('invoices')
    .insert({
      saya_bayar_id: response.invoice_id,
      invoice_number: response.invoice_id,
      user_id: user.id,
      tier_id: tier.id,
      amount: response.amount,
      status: 'pending',
      qris_string: response.qris_image,
      payment_url: response.payment_link,
    })
    .select()
    .single()

  if (insertError) {
    throw new Error(insertError.message)
  }

  return {
    id: response.invoice_id,
    invoice_number: response.invoice_id,
    qris_string: response.qris_image,
    payment_url: response.payment_link,
    expires_at: response.expired_at,
  }
}

export async function createSubscription(
  user: { id: string },
  tier: { id: string },
  expiresAt: string
) {
  'use server'

  const supabase = await createServerClientComponent()

  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: user.id,
      tier_id: tier.id,
      status: 'active',
      expires_at: expiresAt,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }
}
