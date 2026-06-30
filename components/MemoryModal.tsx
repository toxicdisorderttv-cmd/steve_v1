'use client'

import { useEffect, useState, useMemo } from 'react'
import { X, User } from 'lucide-react'
import { Submission } from '@/lib/types'
import CommentSection from './CommentSection'

function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm|ogg|avi|m4v|quicktime)(\?|$)/i.test(url)
}

export default function MemoryModal({
  submission,
  onClose,
}: {
  submission: Submission
  onClose: () => void
}) {
  const photos = useMemo(() => {
    if (submission.photo_urls) {
      try { return JSON.parse(submission.photo_urls) as string[] } catch {}
    }
    return submission.photo_url ? [submission.photo_url] : []
  }, [submission.photo_urls, submission.photo_url])

  const [photoIdx, setPhotoIdx] = useState(0)
  const hasMultiple = photos.length > 1
  const isVideo = photos.length > 0 && (submission.media_type === 'video' || isVideoUrl(photos[0]))

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasMultiple) setPhotoIdx(i => (i - 1 + photos.length) % photos.length)
      if (e.key === 'ArrowRight' && hasMultiple) setPhotoIdx(i => (i + 1) % photos.length)
    }
    document.addEventListener('keydown', handle)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handle)
      document.body.style.overflow = ''
    }
  }, [onClose, hasMultiple, photos.length])

  return (
    <div
      className="fade-in"
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(28, 25, 23, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: 'var(--background)',
          borderRadius: 6,
          border: '1px solid var(--border)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
          maxWidth: 960,
          width: '100%',
          maxHeight: '94vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 10,
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(28,25,23,0.6)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff',
            transition: 'background 0.15s',
          }}
        >
          <X size={22} />
        </button>

        {/* Photo / video — only if media exists */}
        {photos.length > 0 && (
          <div
            style={{
              width: '100%',
              background: '#1C1917',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {isVideo ? (
              <video
                src={photos[0]}
                controls
                playsInline
                autoPlay
                style={{ width: '100%', display: 'block', maxHeight: 640, objectFit: 'contain' }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photos[photoIdx]}
                alt={submission.title}
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 640, objectFit: 'contain' }}
              />
            )}

            {/* Slideshow controls */}
            {hasMultiple && !isVideo && (
              <>
                <button
                  onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                  aria-label="Previous photo"
                  style={{
                    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                    width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#fff', fontSize: '1.5rem', zIndex: 5, lineHeight: 1,
                  }}
                >
                  &#8249;
                </button>
                <button
                  onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                  aria-label="Next photo"
                  style={{
                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                    width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#fff', fontSize: '1.5rem', zIndex: 5, lineHeight: 1,
                  }}
                >
                  &#8250;
                </button>
                <div
                  style={{
                    position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', gap: 8, alignItems: 'center', zIndex: 5,
                    background: 'rgba(0,0,0,0.45)', borderRadius: 99, padding: '6px 14px',
                  }}
                >
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIdx(i)}
                      aria-label={`Photo ${i + 1}`}
                      style={{
                        width: i === photoIdx ? 18 : 7, height: 7, borderRadius: 3.5,
                        background: i === photoIdx ? '#fff' : 'rgba(255,255,255,0.45)',
                        border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s',
                      }}
                    />
                  ))}
                  <span style={{ color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginLeft: 4 }}>
                    {photoIdx + 1} / {photos.length}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Text */}
        <div style={{ padding: '40px 48px 52px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: 18,
              color: 'var(--foreground)',
            }}
          >
            {submission.title}
          </h2>

          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 32,
              paddingBottom: 28,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'var(--amber-light)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <User size={20} color="var(--amber)" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--foreground)' }}>
              {submission.submitter_name}
            </span>
          </div>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--secondary)',
              lineHeight: 1.95,
              whiteSpace: 'pre-wrap',
            }}
          >
            {submission.description}
          </p>
        </div>

        {/* Comments */}
        <CommentSection submissionId={submission.id} />
      </div>
    </div>
  )
}
