# Webhook API Route - PayGet MZ Payment Gateway

import { NextRequest, NextResponse } from 'next/server'
import { createServerClientComponent } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const { invoice_id, status } = payload

    const supabase = await createServerClientComponent()

    if (status === 'paid') {
      await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('saya_bayar_id', invoice_id)

      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('saya_bayar_id', invoice_id)
        .single()

      if (invoiceError || !invoiceData) {
        return NextResponse.json(
          { error: 'Invoice not found' },
          { status: 404 }
        )
      }

      const { data: tier, error: tierError } = await supabase
        .from('tiers')
        .select('*')
        .eq('id', invoiceData.tier_id)
        .single()

      if (tierError || !tier) {
        return NextResponse.json(
          { error: 'Tier not found' },
          { status: 404 }
        )
      }

      const expiresAt = new Date()
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)

      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: invoiceData.user_id,
          tier_id: invoiceData.tier_id,
          status: 'active',
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single()

      if (subscriptionError) {
        console.error('Subscription error:', subscriptionError)
        return NextResponse.json(
          { error: 'Failed to create subscription' },
          { status: 500 }
        )
      }

      console.log(`Subscription created for user ${invoiceData.user_id} on tier ${invoiceData.tier_id}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
