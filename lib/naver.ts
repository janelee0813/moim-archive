import { unstable_cache } from 'next/cache'

async function fetchNaverPlaceImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
        Accept: 'text/html',
      },
      redirect: 'follow',
    })

    if (!res.ok) return null

    const html = await res.text()
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/)
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/)

    return match?.[1] ?? null
  } catch {
    return null
  }
}

export const getNaverPlaceImage = unstable_cache(
  fetchNaverPlaceImage,
  ['naver-place-image'],
  { revalidate: 86400 }
)
