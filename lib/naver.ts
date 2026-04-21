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

    function add(src: string) {
      const cleaned = src.replace(/\\u002F/g, '/').replace(/\\\//g, '/').replace(/&amp;/g, '&')
      if (cleaned.startsWith('http') && !images.includes(cleaned)) images.push(cleaned)
    }

    // 1. og:image meta tag
    for (const m of [
      ...html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/g),
      ...html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/g),
    ]) add(m[1])

    // 2. Naver CDN image URLs embedded directly in HTML/JS
    // ldb-phinf: 네이버 플레이스 사진
    // search.pstatic: 썸네일
    // naverbooking-phinf: 예약 사진
    for (const m of html.matchAll(/https:\/\/(?:ldb-phinf|naverbooking-phinf|ssl\.pstatic|search\.pstatic)\.(?:pstatic\.net|net)\/[^"'\s\\)>]+/g)) {
      const src = m[0].split('"')[0].split("'")[0]
      if (/\.(jpg|jpeg|png|webp)/i.test(src)) add(src)
    }

    // 3. JSON key patterns in embedded scripts
    for (const m of html.matchAll(/"(?:psThumUrl|imageUrl|photoUrl|imgUrl|thumbnailUrl|thumb)"\s*:\s*"([^"]+)"/g)) {
      add(m[1])
    }

    return images.slice(0, 3)
  } catch {
    return []
  }
}

export const getNaverPlaceImages = unstable_cache(
  fetchNaverPlaceImages,
  ['naver-place-images-v2'],
  { revalidate: 86400 }
)
