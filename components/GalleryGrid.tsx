'use client'

import { useState, useMemo } from 'react'
import { User, Maximize2, Search, Play } from 'lucide-react'
import { Submission } from '@/lib/types'
import MemoryModal from './MemoryModal'

type Filter = 'all' | 'family' | 'friend' | 'colleague' | 'other'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'family',    label: 'Family' },
  { value: 'friend',    label: 'Friends' },
  { value: 'colleague', label: 'Colleagues' },
  { value: 'other',     label: 'Other' },
]

function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm|ogg|avi|m4v|quicktime)(\?|$)/i.test(url)
}

function GalleryCard({
  submission,
  onClick,
}: {
  submission: Submission
  onClick: () => void
}) {
  const video = submission.media_type === 'video' || isVideoUrl(submission.photo_url)

  return (
    <article
      className="card-lift"
      style={{
        background: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: 5,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      aria-label={`Read memory: ${submission.title}`}
    >
      {/* Photo / video — only shown if media exists */}
      {submission.photo_url ? (
        <div style={{ position: 'relative', width: '100%', paddingBottom: '66%', background: '#F0E8DC' }}>
          {video ? (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#1C1917',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Play size={28} color="#fff" fill="#fff" />
              </div>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={submission.photo_url}
              alt={submission.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {/* Expand hint */}
          <div
            className="expand-hint"
            style={{
              position: 'absolute', bottom: 14, right: 14,
              background: 'rgba(28,25,23,0.62)', borderRadius: 4,
              padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 7,
              color: '#fff', fontSize: '0.9rem', fontFamily: 'var(--font-mono)',
              opacity: 0, transition: 'opacity 0.2s',
            }}
          >
            <Maximize2 size={15} /> expand
          </div>
        </div>
      ) : null}

      {/* Card content */}
      <div style={{ padding: '16px 20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.05rem',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'var(--foreground)',
            margin: 0,
          }}
        >
          {submission.title}
        </h3>

        {/* Submitter + relationship */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'var(--amber-light)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <User size={20} color="var(--amber)" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '1.15rem', color: 'var(--secondary)', fontWeight: 500 }}>
              {submission.submitter_name}
            </span>
          </div>
          {submission.relationship && submission.relationship !== 'other' && (
            <span style={{
              fontSize: '0.85rem', fontFamily: 'var(--font-mono)',
              color: 'var(--amber)', background: 'var(--amber-light)',
              padding: '4px 10px', borderRadius: 99, whiteSpace: 'nowrap',
            }}>
              {submission.relationship === 'family' ? 'Family' :
               submission.relationship === 'friend' ? 'Friend' : 'Colleague'}
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)' }} />

        {/* Story — always fully shown */}
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--secondary)',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            margin: 0,
          }}
        >
          {submission.description}
        </p>

        {/* Expand cue */}
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontSize: '0.9rem', fontFamily: 'var(--font-mono)',
            color: 'var(--amber)', marginTop: 2, opacity: 0.75,
          }}
        >
          <Maximize2 size={15} /> Click anywhere to view full screen
        </span>
      </div>
    </article>
  )
}

export default function GalleryGrid({ submissions }: { submissions: Submission[] }) {
  const [selected, setSelected] = useState<Submission | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const visible = useMemo(() => {
    let list = submissions
    if (filter !== 'all') list = list.filter(s => s.relationship === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.submitter_name.toLowerCase().includes(q)
      )
    }
    return list
  }, [submissions, filter, search])

  return (
    <>
      <style>{`
        article:hover .expand-hint { opacity: 1 !important; }
      `}</style>

      {/* Search + filter bar */}
      <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Search input */}
        <div style={{ position: 'relative', maxWidth: 520 }}>
          <Search
            size={20}
            style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)', pointerEvents: 'none' }}
          />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, title, or story…"
            style={{
              width: '100%',
              padding: '16px 18px 16px 48px',
              fontSize: '1.2rem',
              fontFamily: 'var(--font-sans)',
              border: '2px solid var(--border)',
              borderRadius: 4,
              outline: 'none',
              background: '#fff',
              color: 'var(--foreground)',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--amber)' }}
            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)' }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '10px 22px',
                fontSize: '1.1rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: filter === f.value ? 600 : 400,
                border: `2px solid ${filter === f.value ? 'var(--amber)' : 'var(--border)'}`,
                borderRadius: 99,
                background: filter === f.value ? 'var(--amber-light)' : '#fff',
                color: filter === f.value ? 'var(--amber)' : 'var(--secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {f.label}
              <span style={{
                marginLeft: 8,
                fontSize: '0.9rem',
                fontFamily: 'var(--font-mono)',
                opacity: 0.7,
              }}>
                {f.value === 'all'
                  ? submissions.length
                  : submissions.filter(s => s.relationship === f.value).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {visible.length === 0 ? (
        <p style={{ fontSize: '1.2rem', color: 'var(--secondary)', padding: '40px 0' }}>
          No memories match that search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10" style={{ alignItems: 'start' }}>
          {visible.map(s => (
            <GalleryCard key={s.id} submission={s} onClick={() => setSelected(s)} />
          ))}
        </div>
      )}

      {selected && (
        <MemoryModal submission={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
