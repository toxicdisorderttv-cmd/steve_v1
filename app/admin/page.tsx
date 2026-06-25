'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check, X, Mail, User, RefreshCw, Lock, Eye, Trash2 } from 'lucide-react'
import { Submission } from '@/lib/types'

type Tab = 'pending' | 'approved' | 'rejected'

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const attempt = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === 'codex') {
      sessionStorage.setItem('admin_auth', 'true')
      onLogin()
    } else {
      setError(true)
      setPw('')
    }
  }

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 40,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--amber-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Lock size={22} color="var(--amber)" strokeWidth={1.5} />
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Admin Access
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--secondary)',
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          Enter the admin password to continue.
        </p>

        <form onSubmit={attempt} className="flex flex-col gap-4">
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false) }}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%',
              padding: '13px 14px',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)',
              border: `1.5px solid ${error ? '#DC2626' : 'var(--border)'}`,
              borderRadius: 4,
              outline: 'none',
              color: 'var(--foreground)',
            }}
          />
          {error && (
            <p style={{ fontSize: '0.88rem', color: '#DC2626', margin: 0 }}>
              Incorrect password. Please try again.
            </p>
          )}
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

function SubmissionRow({
  sub,
  onAction,
  onDelete,
}: {
  sub: Submission
  onAction: (id: string, action: 'approved' | 'rejected') => void
  onDelete: (id: string) => void
}) {
  const [loading, setLoading] = useState<'approved' | 'rejected' | 'delete' | null>(null)

  const act = async (action: 'approved' | 'rejected') => {
    setLoading(action)
    try {
      await fetch(`/api/admin/submissions/${sub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': 'codex' },
        body: JSON.stringify({ status: action }),
      })
      onAction(sub.id, action)
    } finally {
      setLoading(null)
    }
  }

  const del = async () => {
    if (!confirm(`Delete "${sub.title}" by ${sub.submitter_name}? This cannot be undone.`)) return
    setLoading('delete')
    try {
      await fetch(`/api/admin/submissions/${sub.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': 'codex' },
      })
      onDelete(sub.id)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 6,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Photo / video */}
      {sub.photo_url ? (
        <div style={{ position: 'relative', width: '100%', paddingBottom: '55%', background: '#E8DDD0' }}>
          {sub.media_type === 'video' ? (
            <video
              src={sub.photo_url}
              muted
              playsInline
              preload="metadata"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onLoadedMetadata={e => { e.currentTarget.currentTime = 0.1 }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sub.photo_url}
              alt={sub.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
      ) : null}

      {/* Details */}
      <div style={{ padding: 20, flex: 1 }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.1rem',
            marginBottom: 8,
            color: 'var(--foreground)',
          }}
        >
          {sub.title}
        </h3>
        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--secondary)',
            lineHeight: 1.7,
            marginBottom: 14,
          }}
        >
          {sub.description}
        </p>

        <div className="flex flex-col gap-2" style={{ marginBottom: 16 }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.88rem',
              color: 'var(--secondary)',
            }}
          >
            <User size={14} strokeWidth={1.5} /> {sub.submitter_name}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.88rem',
              color: 'var(--secondary)',
            }}
          >
            <Mail size={14} strokeWidth={1.5} /> {sub.submitter_email}
          </span>
        </div>

        {/* Status badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          {sub.status === 'approved' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 500, color: '#065F46', background: '#D1FAE5', padding: '5px 11px', borderRadius: 4 }}>
              <Eye size={14} /> Live on site
            </span>
          )}
          {sub.status === 'rejected' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 500, color: '#991B1B', background: '#FEE2E2', padding: '5px 11px', borderRadius: 4 }}>
              <X size={14} /> Rejected
            </span>
          )}
          {sub.status === 'pending' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 500, color: '#92400E', background: '#FEF3C7', padding: '5px 11px', borderRadius: 4 }}>
              Awaiting review
            </span>
          )}
        </div>

        {/* Action buttons — always shown, current status disabled */}
        <div className="flex gap-3">
          <button
            onClick={() => act('approved')}
            disabled={!!loading || sub.status === 'approved'}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px', background: sub.status === 'approved' ? '#F0FDF4' : '#D1FAE5',
              color: '#065F46', border: '1px solid #6EE7B7', borderRadius: 4,
              fontWeight: 500, fontSize: '0.9rem',
              cursor: (loading || sub.status === 'approved') ? 'not-allowed' : 'pointer',
              opacity: sub.status === 'approved' ? 0.45 : loading ? 0.6 : 1,
            }}
          >
            <Check size={15} /> {sub.status === 'approved' ? 'Approved' : 'Approve'}
          </button>
          <button
            onClick={() => act('rejected')}
            disabled={!!loading || sub.status === 'rejected'}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px', background: sub.status === 'rejected' ? '#FFF5F5' : '#FEE2E2',
              color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: 4,
              fontWeight: 500, fontSize: '0.9rem',
              cursor: (loading || sub.status === 'rejected') ? 'not-allowed' : 'pointer',
              opacity: sub.status === 'rejected' ? 0.45 : loading ? 0.6 : 1,
            }}
          >
            <X size={15} /> {sub.status === 'rejected' ? 'Rejected' : 'Reject'}
          </button>
          <button
            onClick={del}
            disabled={!!loading}
            title="Delete permanently"
            style={{
              width: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '10px', background: '#FFF5F5',
              color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading === 'delete' ? 0.6 : 1, flexShrink: 0,
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('pending')

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      setAuthed(true)
    }
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/submissions', {
        headers: { 'x-admin-password': 'codex' },
      })
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data.submissions ?? [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed) fetchAll()
  }, [authed, fetchAll])

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setSubmissions(prev =>
      prev.map(s => (s.id === id ? { ...s, status: action } : s))
    )
  }

  const handleDelete = (id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id))
  }

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />

  const filtered = submissions.filter(s => s.status === tab)

  const tabStyle = (t: Tab) => ({
    padding: '10px 20px',
    fontSize: '0.95rem',
    fontWeight: tab === t ? 600 : 400,
    color: tab === t ? 'var(--amber)' : 'var(--secondary)',
    background: 'none',
    border: 'none',
    borderBottom: tab === t ? '2px solid var(--amber)' : '2px solid transparent',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'color 0.15s',
  })

  const count = (t: Tab) => submissions.filter(s => s.status === t).length

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <span className="section-label">Private</span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              marginTop: 8,
              marginBottom: 4,
            }}
          >
            Submission Queue
          </h1>
          <span className="amber-rule" />
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 18px',
            border: '1.5px solid var(--border)',
            borderRadius: 4,
            background: '#fff',
            color: 'var(--secondary)',
            fontSize: '0.9rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
        <div className="flex gap-0">
          {(['pending', 'approved', 'rejected'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabStyle(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {' '}
              <span
                style={{
                  display: 'inline-block',
                  background: tab === t ? 'var(--amber-light)' : 'var(--border)',
                  color: tab === t ? 'var(--amber)' : 'var(--secondary)',
                  borderRadius: 99,
                  padding: '1px 8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginLeft: 4,
                }}
              >
                {count(t)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--secondary)' }}>
          Loading submissions…
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 0',
            border: '1px dashed var(--border)',
            borderRadius: 6,
          }}
        >
          <p style={{ color: 'var(--secondary)', fontSize: '1rem' }}>
            No {tab} submissions yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(s => (
            <SubmissionRow key={s.id} sub={s} onAction={handleAction} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
