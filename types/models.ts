import { Database } from './supabase'

export type Tier = Database['public']['Tables']['tiers']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
