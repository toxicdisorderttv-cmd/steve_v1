'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, User } from 'lucide-react'
import { Submission } from '@/lib/types'

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
  const hasMedia = !!submission.photo_url
  const video = hasMedia && (submission.media_type === 'video' || isVideoUrl(submission.photo_url))

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handle)
      document.body.style.overflow = ''
    }
  }, [onClose])

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
        {hasMedia && (
          <div
            style={{
              width: '100%',
              background: '#1C1917',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {video ? (
              <video
                src={submission.photo_url}
                controls
                playsInline
                autoPlay
                style={{ width: '100%', display: 'block', maxHeight: 640, objectFit: 'contain' }}
              />
            ) : (
              <Image
                src={submission.photo_url}
                alt={submission.title}
                width={0}
                height={0}
                sizes="960px"
                priority
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 640, objectFit: 'contain' }}
              />
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
      </div>
    </div>
  )
}
