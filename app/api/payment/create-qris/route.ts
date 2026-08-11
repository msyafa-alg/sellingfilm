// Payment API Routes

import { NextRequest, NextResponse } from 'next/server'
import { createServerClientComponent } from '@/lib/supabase/server'
import { SayaBayarClient } from '@/lib/saya-bayar/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClientComponent()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { tierId } = await request.json()

    if (!tierId) {
      return NextResponse.json(
        { error: 'Tier ID is required' },
        { status: 400 }
      )
    }

    const { data: tier, error: tierError } = await supabase
      .from('tiers')
      .select('*')
      .eq('id', tierId)
      .single()

    if (tierError || !tier) {
      return NextResponse.json(
        { error: 'Tier not found' },
        { status: 404 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    const sayaBayar = new SayaBayarClient(process.env.SAYA_BAYAR_API_KEY!)

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`

    const response = await sayaBayar.createInvoice({
      customer_name: profile.full_name || user.email!.split('@')[0],
      customer_email: user.email!,
      amount: tier.price,
      description: `Pembelian Tier ${tier.name} - lordarky.syafapnl.biz.id`,
      channel_preference: 'client',
      payment_method: 'qris',
      redirect_url: redirectUrl,
    })

    if (!response.success) {
      return NextResponse.json(
        { error: 'Failed to create invoice' },
        { status: 500 }
      )
    }

    const invoiceData = response.data

    const { error: insertError } = await supabase
      .from('invoices')
      .insert({
        saya_bayar_id: invoiceData.id,
        invoice_number: invoiceData.invoice_number,
        user_id: user.id,
        tier_id: tier.id,
        amount: invoiceData.amount,
        status: 'pending',
        qris_string: invoiceData.payment_channel.qris_string,
        payment_url: invoiceData.payment_channel.payment_url,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to save invoice' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        invoice_id: invoiceData.id,
        invoice_number: invoiceData.invoice_number,
        amount: invoiceData.amount,
        qris_string: invoiceData.payment_channel.qris_string,
        payment_url: invoiceData.payment_channel.payment_url,
        expires_at: invoiceData.expires_at,
      },
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
