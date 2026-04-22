import Image from 'next/image'
import { getNaverPlaceImages } from '@/lib/naver'

export default async function StoreImages({ url, name }: { url: string; name: string }) {
  const images = await getNaverPlaceImages(url)
  if (images.length === 0) return null

  return (
    <div className={`grid gap-0.5 h-52 ${
      images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
    }`}>
      {images.map((src, i) => (
        <div key={i} className="relative overflow-hidden bg-gray-100">
          <Image src={src} alt="" fill className="object-cover scale-110 blur-xl opacity-60" unoptimized aria-hidden />
          <Image src={src} alt={`${name} ${i + 1}`} fill className="object-contain" unoptimized />
        </div>
      ))}
    </div>
  )
}
