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

export default function CommentSection({ submissionId }: { submissionId: string }) {
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
    <div style={{ borderTop: '1px solid var(--border)', padding: '32px 48px 48px' }}>
      {/* Heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <MessageCircle size={20} color="var(--amber)" strokeWidth={1.75} />
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.4rem',
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
          padding: '12px 16px', margin: '16px 0 24px',
        }}
      >
        <Info size={16} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.88rem', color: 'var(--secondary)', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-mono)' }}>
          Leave a kind word for Steve and his family below — just add your name and a short
          message and hit &quot;Post Comment.&quot; Comments appear right away for everyone to see,
          so please keep them warm and respectful.
        </p>
      </div>

      {/* Comment list */}
      {loading ? (
        <p style={{ fontSize: '0.95rem', color: 'var(--secondary)' }}>Loading comments…</p>
      ) : comments.length === 0 ? (
        <p style={{ fontSize: '0.95rem', color: 'var(--secondary)', marginBottom: 24 }}>
          No comments yet — be the first to share a word.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          {comments.map(c => (
            <div key={c.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                <span style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--foreground)' }}>
                  {c.commenter_name}
                </span>
                <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--secondary)', whiteSpace: 'nowrap' }}>
                  {timeAgo(c.created_at)}
                </span>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--secondary)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          maxLength={80}
          style={{
            padding: '12px 14px',
            fontSize: '0.98rem',
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
          rows={3}
          style={{
            padding: '12px 14px',
            fontSize: '0.98rem',
            fontFamily: 'var(--font-sans)',
            border: '1.5px solid var(--border)',
            borderRadius: 4,
            outline: 'none',
            resize: 'vertical',
            color: 'var(--foreground)',
          }}
        />
        {error && (
          <p style={{ fontSize: '0.88rem', color: '#B91C1C', margin: 0 }}>{error}</p>
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
          }}
        >
          <Send size={16} />
          {submitting ? 'Posting…' : 'Post Comment'}
        </button>
      </form>
    </div>
  )
}
