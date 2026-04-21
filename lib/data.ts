import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

function getPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const getStores = unstable_cache(
  async (category?: string, region?: string) => {
    const supabase = getPublicClient()

    let query = supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (region) query = query.eq('region', region)

    const { data } = await query
    return data ?? []
  },
  ['stores'],
  { revalidate: 60 }
)
