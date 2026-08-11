# Webhook API Route - Saya Bayar Payment Gateway

import { NextRequest, NextResponse } from 'next/server'
import { createServerClientComponent } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('X-Webhook-Signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    const rawBody = await request.text()
    const crypto = await import('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', process.env.SAYA_BAYAR_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest('hex')

    if (!crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const payload = JSON.parse(rawBody)
    const { event, data } = payload

    const supabase = createServerClientComponent()

    if (event === 'invoice.paid') {
      const invoice = data

      // Update invoice status
      await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('saya_bayar_id', invoice.id)

      // Get invoice details
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('saya_bayar_id', invoice.id)
        .single()

      if (invoiceError || !invoiceData) {
        return NextResponse.json(
          { error: 'Invoice not found' },
          { status: 404 }
        )
      }

      // Get tier details
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

      // Calculate expiry date (1 year from now)
      const expiresAt = new Date()
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)

      // Create or update subscription
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
