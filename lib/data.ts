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
      .select('*, profiles(nickname)')
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (region) query = query.eq('region', region)

    const { data } = await query
    return data ?? []
  },
  ['stores-v2'],
  { revalidate: 60 }
)

export async function getAndIncrementVisits(): Promise<number> {
  const supabase = getPublicClient()
  try {
    await supabase.from('page_views').insert({})
    const { count } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
    return count ?? 0
  } catch {
    return 0
  }
}
