// PayGet MZ API Client
export interface PayGetCreateInvoiceResponse {
  success: boolean
  invoice_id: string
  amount: number
  fee: number
  total: number
  qris_image: string
  payment_link: string
  expired_at: string
}

export interface PayGetInvoiceStatusResponse {
  invoice_id: string
  amount: number
  fee: number
  total: number
  status: string
  qris_image: string
  payment_link: string
  expired_at: string
  created_at: string
}

export class PayGetClient {
  private baseUrl = 'https://gateway.mzmanglz.my.id/api'

  constructor(private apiKey: string) {}

  private async get(endpoint: string, params: Record<string, string | number>) {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    url.searchParams.set('apikey', this.apiKey)
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`PayGet API error: ${response.status}`)
    }

    return response.json()
  }

  async createInvoice(amount: number) {
    return this.get('/invoice', { amount }) as Promise<PayGetCreateInvoiceResponse>
  }

  async checkInvoiceStatus(invoiceId: string) {
    return this.get('/invoice/status', { invoice_id: invoiceId }) as Promise<PayGetInvoiceStatusResponse>
  }

  async checkBalance() {
    return this.get('/balance', {}) as Promise<{
      username: string
      email: string
      balance: number
    }>
  }
}
