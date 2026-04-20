'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Props {
  label: string
  items: { label: string; value: string }[]
  paramKey: string
}

export default function NavDropdown({ label, items, paramKey }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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
          {items.map(item => (
            <Link
              key={item.value}
              href={`/?${paramKey}=${encodeURIComponent(item.value)}`}
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
