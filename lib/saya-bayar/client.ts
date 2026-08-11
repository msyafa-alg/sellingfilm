# Saya Bayar API Client
export interface SayaBayarCreateInvoiceRequest {
  customer_name: string
  customer_email: string
  amount: number
  description: string
  channel_preference: 'client' | 'server'
  payment_method: 'qris'
  redirect_url: string
}

export interface SayaBayarCreateInvoiceResponse {
  success: boolean
  message: string
  data: {
    id: string
    invoice_number: string
    customer_name: string
    customer_email: string
    amount: number
    description: string
    status: string
    payment_channel: {
      qris_string: string
      payment_url: string
    }
    created_at: string
    expires_at: string
  }
}

export class SayaBayarClient {
  private baseUrl = 'https://api.sayabayar.com'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    }

    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Saya Bayar API error: ${response.status}`)
    }

    return response.json()
  }

  async createInvoice(request: SayaBayarCreateInvoiceRequest) {
    return this.request('/v1/invoices', {
      method: 'POST',
      body: JSON.stringify(request),
    }) as Promise<SayaBayarCreateInvoiceResponse>
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    const secret = process.env.SAYA_BAYAR_WEBHOOK_SECRET
    if (!secret) return false

    const crypto = await import('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }
}
