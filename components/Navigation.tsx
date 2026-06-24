'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/stories', label: 'Stories & Photographs' },
  { href: '/add-memory', label: 'Add a Memory' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--background)' }}
      className="sticky top-0 z-50"
    >
      <div
        className="max-w-7xl mx-auto px-8 flex items-center justify-between"
        style={{ height: 108 }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--foreground)',
            fontSize: '1.9rem',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '-0.01em',
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.1,
          }}
        >
          Steve Beal
          <span
            className="mono-label"
            style={{ marginTop: 5, fontSize: '0.8rem' }}
          >
            Whisky Hall of Fame · #25
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-12">
          {links.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.3rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--amber)' : 'var(--secondary)',
                  textDecoration: 'none',
                  borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent',
                  paddingBottom: '3px',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {open ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{ borderTop: '1px solid var(--border)', background: 'var(--background)' }}
          className="md:hidden px-8 py-7 flex flex-col gap-8"
        >
          {links.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.5rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--amber)' : 'var(--foreground)',
                  textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
