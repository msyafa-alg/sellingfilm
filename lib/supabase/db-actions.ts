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

  const { SayaBayarClient } = await import('@/lib/saya-bayar/client')
  const sayaBayar = new SayaBayarClient(process.env.SAYA_BAYAR_API_KEY!)
  
  const supabase = await createServerClientComponent()

  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`

  const invoiceData = {
    customer_name: user.full_name,
    customer_email: user.email,
    amount: tier.price,
    description: `Pembelian Tier ${tier.name} - lordarky.syafapnl.biz.id`,
    channel_preference: 'client',
    payment_method: 'qris',
    redirect_url: redirectUrl,
  }

  const response = await sayaBayar.createInvoice(invoiceData)

  if (!response.success) {
    throw new Error('Failed to create invoice')
  }

  const invoice = response.data

  const { error: insertError } = await supabase
    .from('invoices')
    .insert({
      saya_bayar_id: invoice.id,
      invoice_number: invoice.invoice_number,
      user_id: user.id,
      tier_id: tier.id,
      amount: invoice.amount,
      status: 'pending',
      qris_string: invoice.payment_channel.qris_string,
      payment_url: invoice.payment_channel.payment_url,
    })
    .select()
    .single()

  if (insertError) {
    throw new Error(insertError.message)
  }

  return invoice
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
