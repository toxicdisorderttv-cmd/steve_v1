'use client'

import { useEffect, useState } from 'react'
import { X, Camera, PlusCircle, BookOpen } from 'lucide-react'

const STORAGE_KEY = 'steve_welcome_dismissed'

export default function WelcomeOverlay() {
  const [visible, setVisible] = useState(false)
  const [neverShow, setNeverShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  const dismiss = () => {
    if (neverShow) localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'rgba(28, 25, 23, 0.6)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '52px 48px 44px',
          maxWidth: 640,
          width: '100%',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: 'absolute', top: 18, right: 18,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--secondary)', padding: 6, borderRadius: 4,
            transition: 'color 0.15s',
          }}
        >
          <X size={26} />
        </button>

        {/* Header */}
        <span className="section-label" style={{ fontSize: '0.85rem' }}>Welcome</span>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.9rem, 4vw, 2.6rem)',
            marginTop: 12,
            marginBottom: 6,
            lineHeight: 1.2,
          }}
        >
          A Tribute to Steve Beal
        </h2>
        <span className="amber-rule" style={{ marginBottom: 24 }} />

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--secondary)',
            lineHeight: 1.8,
            marginBottom: 36,
          }}
        >
          This site is a gift — a place for family and friends to share their memories,
          photos, and videos about Steve. Here&apos;s how it works:
        </p>

        {/* Steps */}
        <div className="flex flex-col gap-7" style={{ marginBottom: 40 }}>
          {[
            {
              icon: BookOpen,
              title: 'Read his story',
              body: "The home page tells Steve's remarkable career — from Bulleit Bourbon to the Whisky Hall of Fame.",
            },
            {
              icon: Camera,
              title: 'Browse memories',
              body: '"Stories & Photographs" is where photos and stories shared by people who know him appear.',
            },
            {
              icon: PlusCircle,
              title: 'Add your own memory',
              body: '"Add a Memory" lets you upload a photo or video and share your story. It\'s reviewed before it appears.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 52, height: 52, borderRadius: 6,
                  background: 'var(--amber-light)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <Icon size={26} color="var(--amber)" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '1.15rem', marginBottom: 5, color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>
                  {title}
                </p>
                <p style={{ fontSize: '1rem', color: 'var(--secondary)', lineHeight: 1.7 }}>
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={dismiss}
          className="btn-primary"
          style={{ width: '100%', fontSize: '1.2rem', padding: '18px', marginBottom: 18 }}
        >
          Got it — show me the site
        </button>

        <label
          style={{
            display: 'flex', alignItems: 'center',
            gap: 12, cursor: 'pointer', justifyContent: 'center',
          }}
        >
          <input
            type="checkbox"
            checked={neverShow}
            onChange={e => setNeverShow(e.target.checked)}
            style={{ width: 20, height: 20, accentColor: 'var(--amber)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '1rem', color: 'var(--secondary)' }}>
            Don&apos;t show this again
          </span>
        </label>
      </div>
    </div>
  )
}
