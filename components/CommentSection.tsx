'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Send, Info } from 'lucide-react'
import { Comment } from '@/lib/types'

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function CommentSection({ submissionId, compact = false }: { submissionId: string; compact?: boolean }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/comments?submission_id=${submissionId}`)
      .then(res => res.json())
      .then(data => { if (!cancelled) setComments(data.comments ?? []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [submissionId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !message.trim()) {
      setError('Please add your name and a comment.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: submissionId, commenter_name: name.trim(), body: message.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }
      setComments(prev => [...prev, data.comment])
      setMessage('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ borderTop: compact ? 'none' : '1px solid var(--border)', padding: compact ? '0' : '32px 48px 48px' }}>
      {/* Heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <MessageCircle size={compact ? 16 : 20} color="var(--amber)" strokeWidth={1.75} />
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: compact ? '1.05rem' : '1.4rem',
            fontWeight: 700,
            color: 'var(--foreground)',
            margin: 0,
          }}
        >
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {/* How-to reminder */}
      <div
        style={{
          display: 'flex', gap: 10, alignItems: 'flex-start',
          background: 'var(--amber-light)', borderRadius: 4,
          padding: compact ? '10px 12px' : '12px 16px', margin: compact ? '12px 0 16px' : '16px 0 24px',
        }}
      >
        <Info size={16} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: compact ? '0.82rem' : '0.88rem', color: 'var(--secondary)', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-mono)' }}>
          Have something to say about this memory, or remember this moment yourself?
          Add your name and a message below — comments appear right away for everyone to see.
        </p>
      </div>

      {/* Comment list */}
      {loading ? (
        <p style={{ fontSize: compact ? '0.85rem' : '0.95rem', color: 'var(--secondary)' }}>Loading comments…</p>
      ) : comments.length === 0 ? (
        <p style={{ fontSize: compact ? '0.85rem' : '0.95rem', color: 'var(--secondary)', marginBottom: compact ? 16 : 24 }}>
          No comments yet — be the first to share a word.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 12 : 16, marginBottom: compact ? 18 : 28 }}>
          {comments.map(c => (
            <div key={c.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: compact ? 12 : 16 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                <span style={{ fontSize: compact ? '0.88rem' : '0.98rem', fontWeight: 600, color: 'var(--foreground)' }}>
                  {c.commenter_name}
                </span>
                <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--secondary)', whiteSpace: 'nowrap' }}>
                  {timeAgo(c.created_at)}
                </span>
              </div>
              <p style={{ fontSize: compact ? '0.85rem' : '0.95rem', color: 'var(--secondary)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: compact ? 8 : 12 }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          maxLength={80}
          style={{
            padding: compact ? '9px 12px' : '12px 14px',
            fontSize: compact ? '0.88rem' : '0.98rem',
            fontFamily: 'var(--font-sans)',
            border: '1.5px solid var(--border)',
            borderRadius: 4,
            outline: 'none',
            color: 'var(--foreground)',
          }}
        />
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Write a comment…"
          maxLength={1000}
          rows={compact ? 2 : 3}
          style={{
            padding: compact ? '9px 12px' : '12px 14px',
            fontSize: compact ? '0.88rem' : '0.98rem',
            fontFamily: 'var(--font-sans)',
            border: '1.5px solid var(--border)',
            borderRadius: 4,
            outline: 'none',
            resize: 'vertical',
            color: 'var(--foreground)',
          }}
        />
        {error && (
          <p style={{ fontSize: '0.85rem', color: '#B91C1C', margin: 0 }}>{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
          style={{
            alignSelf: 'flex-start',
            display: 'flex', alignItems: 'center', gap: 8,
            opacity: submitting ? 0.6 : 1,
            cursor: submitting ? 'default' : 'pointer',
            ...(compact ? { padding: '9px 18px', fontSize: '0.88rem' } : {}),
          }}
        >
          <Send size={compact ? 14 : 16} />
          {submitting ? 'Posting…' : 'Post Comment'}
        </button>
      </form>
    </div>
  )
}
