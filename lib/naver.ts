import { unstable_cache } from 'next/cache'

async function fetchNaverPlaceImages(url: string): Promise<string[]> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
        Accept: 'text/html',
      },
      redirect: 'follow',
    })

    if (!res.ok) return []

    const html = await res.text()
    const images: string[] = []

    // og:image meta tags (both attribute orders)
    const ogMatches = [
      ...html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/g),
      ...html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/g),
    ]
    for (const m of ogMatches) {
      if (m[1] && !images.includes(m[1])) images.push(m[1])
    }

    // Naver Place stores images in JSON embedded in script tags
    // Look for psThumUrl or imageUrl patterns common in Naver Place JSON
    const jsonImageMatches = html.matchAll(/"(?:psThumUrl|imageUrl|photoUrl|imgUrl)"\s*:\s*"([^"]+)"/g)
    for (const m of jsonImageMatches) {
      const imgUrl = m[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/')
      if (imgUrl.startsWith('http') && !images.includes(imgUrl)) images.push(imgUrl)
    }

    return images.slice(0, 3)
  } catch {
    return []
  }
}

export const getNaverPlaceImages = unstable_cache(
  fetchNaverPlaceImages,
  ['naver-place-images'],
  { revalidate: 86400 }
)
