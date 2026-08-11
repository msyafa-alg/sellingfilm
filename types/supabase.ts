export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          created_at?: string
        }
      }
      tiers: {
        Row: {
          id: string
          name: string
          price: number
          description: string | null
          telegram_group_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          description?: string | null
          telegram_group_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          description?: string | null
          telegram_group_url?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier_id: string
          status: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier_id: string
          status?: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier_id?: string
          status?: string
          expires_at?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          saya_bayar_id: string
          invoice_number: string
          user_id: string
          tier_id: string
          amount: number
          status: string
          qris_string: string | null
          payment_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          saya_bayar_id: string
          invoice_number: string
          user_id: string
          tier_id: string
          amount: number
          status?: string
          qris_string?: string | null
          payment_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          saya_bayar_id?: string
          invoice_number?: string
          user_id?: string
          tier_id?: string
          amount?: number
          status?: string
          qris_string?: string | null
          payment_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
