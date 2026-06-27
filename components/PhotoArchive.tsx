'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const PHOTOS = Array.from({ length: 11 }, (_, i) => `/steve-photos/steve-${i + 1}.jpg`)

export default function PhotoArchive() {
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    if (selected === null) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowLeft') setSelected(i => i !== null ? (i - 1 + PHOTOS.length) % PHOTOS.length : null)
      if (e.key === 'ArrowRight') setSelected(i => i !== null ? (i + 1) % PHOTOS.length : null)
    }
    document.addEventListener('keydown', handle)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handle)
      document.body.style.overflow = ''
    }
  }, [selected])

  return (
    <>
      <style>{`
        .archive-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        @media (max-width: 900px) { .archive-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px) { .archive-grid { grid-template-columns: repeat(2, 1fr); } }
        .archive-photo {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          border-radius: 3px;
          border: 1px solid var(--border);
          background: #E8DDD0;
          cursor: pointer;
        }
        .archive-photo img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.4s ease;
        }
        .archive-photo:hover img { transform: scale(1.04); }
        .archive-expand-hint {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s;
          background: rgba(28,25,23,0.22);
        }
        .archive-photo:hover .archive-expand-hint { opacity: 1; }
        .lightbox-btn {
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255,255,255,0.12); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff; transition: background 0.15s;
          flex-shrink: 0;
        }
        .lightbox-btn:hover { background: rgba(255,255,255,0.22); }
      `}</style>

      <p style={{
        fontSize: '0.82rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--secondary)',
        marginBottom: 24,
        opacity: 0.7,
        letterSpacing: '0.04em',
      }}>
        Click any photo to enlarge · use arrow keys to browse
      </p>

      <div className="archive-grid">
        {PHOTOS.map((src, i) => (
          <div
            key={i}
            className="archive-photo"
            onClick={() => setSelected(i)}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelected(i) }}
            aria-label={`Enlarge photograph ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Steve Beal — photograph ${i + 1}`}
              loading={i < 4 ? 'eager' : 'lazy'}
            />
            <div className="archive-expand-hint">
              <span style={{
                color: '#fff', fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                background: 'rgba(0,0,0,0.48)',
                padding: '5px 12px', borderRadius: 3,
              }}>
                expand
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fade-in"
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(10,8,6,0.93)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px 80px',
          }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}
        >
          {/* Close */}
          <button
            onClick={() => setSelected(null)}
            aria-label="Close"
            style={{
              position: 'absolute', top: 18, right: 18, zIndex: 10,
            }}
            className="lightbox-btn"
          >
            <X size={22} />
          </button>

          {/* Prev */}
          <button
            onClick={() => setSelected(i => i !== null ? (i - 1 + PHOTOS.length) % PHOTOS.length : null)}
            aria-label="Previous photo"
            className="lightbox-btn"
            style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }}
          >
            <ChevronLeft size={28} />
          </button>

          {/* Photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PHOTOS[selected]}
            alt={`Steve Beal — photograph ${selected + 1}`}
            style={{
              maxWidth: '100%', maxHeight: '88vh',
              objectFit: 'contain', display: 'block',
              borderRadius: 3,
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}
          />

          {/* Next */}
          <button
            onClick={() => setSelected(i => i !== null ? (i + 1) % PHOTOS.length : null)}
            aria-label="Next photo"
            className="lightbox-btn"
            style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)' }}
          >
            <ChevronRight size={28} />
          </button>

          {/* Counter */}
          <span style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
          }}>
            {selected + 1} / {PHOTOS.length}
          </span>
        </div>
      )}
    </>
  )
}
