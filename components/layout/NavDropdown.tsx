'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Props {
  label: string
  items: { label: string; value: string }[]
  paramKey: string
}

export default function NavDropdown({ label, items, paramKey }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const currentView = searchParams.get('view')

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function buildHref(value: string | null) {
    const params = new URLSearchParams()
    if (value) params.set(paramKey, value)
    if (currentView) params.set('view', currentView)
    const qs = params.toString()
    return qs ? `/?${qs}` : '/'
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 text-gray-600 hover:text-black text-sm"
      >
        {label}
        <span className="text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
          <Link
            href={buildHref(null)}
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            전체보기
          </Link>
          {items.map(item => (
            <Link
              key={item.value}
              href={buildHref(item.value)}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
