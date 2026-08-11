import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PayGetClient } from '@/lib/payget/client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
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

    const payGet = new PayGetClient(process.env.PAYGET_API_KEY!)

    const response = await payGet.createInvoice(tier.price)

    if (!response.success) {
      return NextResponse.json(
        { error: 'Failed to create invoice' },
        { status: 500 }
      )
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
      return NextResponse.json(
        { error: 'Failed to save invoice' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        invoice_id: response.invoice_id,
        invoice_number: response.invoice_id,
        amount: response.amount,
        qris_image: response.qris_image,
        payment_link: response.payment_link,
        expired_at: response.expired_at,
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
