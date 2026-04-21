import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cacheLife } from 'next/cache'

function getPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function getStores(category?: string, region?: string) {
  'use cache'
  cacheLife('minutes')

  const supabase = getPublicClient()

  let query = supabase
    .from('stores')
    .select('*')
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)
  if (region) query = query.eq('region', region)

  const { data } = await query
  return data ?? []
}
