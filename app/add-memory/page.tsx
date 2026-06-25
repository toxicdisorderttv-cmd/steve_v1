'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, CheckCircle, AlertCircle, ImagePlus, Film, HelpCircle, Camera, Type, AlignLeft, User, Mail, Heart } from 'lucide-react'

type Status = 'idle' | 'uploading' | 'success' | 'error'
type MediaKind = 'image' | 'video'

function HelpModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon: Type,      title: 'Give it a title',         body: 'Write a short title for your memory — like "A summer visit in 1998" or "The night we first met."' },
    { icon: Camera,    title: 'Add your photo or video', body: 'Optional — tap the upload area to add a photo or short video. A written story on its own is just as welcome.' },
    { icon: AlignLeft, title: 'Write your story',        body: 'Tell us whatever feels right — a few sentences or a few paragraphs. Long stories are very welcome.' },
    { icon: Heart,     title: 'How you know Steve',      body: 'Choose whether you are family, a friend, a colleague, or other. This lets visitors filter memories.' },
    { icon: User,      title: 'Your name',               body: 'This is how you\'ll be credited on the site. First name only is completely fine.' },
    { icon: Mail,      title: 'Your email',              body: 'We only use this to reach you if we have a question before publishing. It is never shown publicly.' },
  ]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: 'var(--background)', borderRadius: 8,
          border: '1px solid var(--border)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto',
          padding: '48px 44px 44px', position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--secondary)', padding: 4,
          }}
        >
          <X size={24} />
        </button>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amber)' }}>How it works</span>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.7rem, 3vw, 2.2rem)', marginTop: 10, marginBottom: 6 }}>
          How to Add a Memory
        </h2>
        <div style={{ width: 48, height: 2, background: 'var(--amber)', marginBottom: 28 }} />

        <p style={{ fontSize: '1.1rem', color: 'var(--secondary)', lineHeight: 1.75, marginBottom: 32 }}>
          It only takes a few minutes. Fill in the five fields below and hit Submit — someone will
          review it before it appears on the site.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 36 }}>
          {steps.map(({ icon: Icon, title, body }, i) => (
            <div key={title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--amber)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
              </div>
              <div style={{ paddingTop: 6 }}>
                <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={18} color="var(--amber)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  {title}
                </p>
                <p style={{ fontSize: '1rem', color: 'var(--secondary)', lineHeight: 1.7 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '17px' }}>
          Got it — I&apos;m ready
        </button>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-sans)',
  color: 'var(--foreground)',
  background: '#fff',
  border: '2px solid var(--border)',
  borderRadius: 3,
  outline: 'none',
  lineHeight: 1.65,
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'var(--foreground)',
  marginBottom: 6,
}

const hintStyle: React.CSSProperties = {
  fontSize: '0.82rem',
  color: 'var(--secondary)',
  marginBottom: 8,
  lineHeight: 1.65,
}

function getMediaKind(file: File): MediaKind | null {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  return null
}

export default function AddMemoryPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [relationship, setRelationship] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [mediaKind, setMediaKind] = useState<MediaKind | null>(null)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const kind = getMediaKind(f)
    if (!kind) {
      setErrorMsg('Please select an image or video file.')
      return
    }
    if (kind === 'video' && f.size > 200 * 1024 * 1024) {
      setErrorMsg('Videos must be under 200 MB. Try trimming it first.')
      return
    }
    setFile(f)
    setMediaKind(kind)
    setPreview(URL.createObjectURL(f))
    setErrorMsg('')
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }, [])

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    setMediaKind(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('uploading')
    setErrorMsg('')

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('submitter_name', name)
      formData.append('submitter_email', email)
      formData.append('relationship', relationship || 'other')

      if (file && (mediaKind === 'video' || mediaKind === 'image')) {
        // Upload directly to Supabase from the browser — bypasses Vercel's 4.5 MB API body limit
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const ext = file.name.split('.').pop()?.toLowerCase() ?? (mediaKind === 'video' ? 'mp4' : 'jpg')
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filename, file, { contentType: file.type })
        if (uploadError) throw new Error(`${mediaKind === 'video' ? 'Video' : 'Image'} upload failed. Please try again.`)
        const { data: urlData } = supabase.storage.from('photos').getPublicUrl(filename)
        formData.append('photo_url', urlData.publicUrl)
        formData.append('media_type', mediaKind)
      } else {
        formData.append('media_type', 'text')
      }

      const res = await fetch('/api/submissions', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <section className="max-w-2xl mx-auto px-6 py-20 md:py-28 text-center">
        <div
          style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--amber-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          }}
        >
          <CheckCircle size={36} color="var(--amber)" strokeWidth={1.5} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: 16 }}>
          Thank you for sharing.
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--secondary)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto 32px' }}>
          Your memory has been received and will appear on the Stories &amp; Photographs page once reviewed.
        </p>
        <a href="/stories" className="btn-primary">View Stories &amp; Photographs</a>
      </section>
    )
  }

  return (
    <>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(to bottom, #F0E6D6 0%, var(--background) 100%)',
          borderBottom: '1px solid var(--border)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div className="dot-grid" />
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-label">Contribute</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, marginTop: 14, marginBottom: 4 }}>
            Add a Memory
          </h1>
          <span className="amber-rule" style={{ marginBottom: 20 }} />
          <p style={{ fontSize: '1.3rem', color: 'var(--secondary)', maxWidth: 580, lineHeight: 1.8, marginBottom: 28 }}>
            Share a photo or video and a few words about Steve. All submissions are reviewed before appearing on the site.
          </p>
          <button
            onClick={() => setShowHelp(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              padding: '16px 28px',
              background: 'var(--background)',
              border: '2px solid var(--amber)',
              borderRadius: 4, cursor: 'pointer',
              color: 'var(--amber)', fontFamily: 'var(--font-sans)',
              fontSize: '1.2rem', fontWeight: 500,
              transition: 'background 0.15s',
            }}
          >
            <HelpCircle size={24} strokeWidth={1.5} />
            Not sure how this works? Click here for help
          </button>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <form onSubmit={handleSubmit} className="flex flex-col gap-9">

          {/* Title */}
          <div>
            <label htmlFor="title" style={labelStyle}>
              Title <span style={{ color: 'var(--amber)' }}>*</span>
            </label>
            <p style={hintStyle}>A short title for your memory — e.g. "The night we poured Bulleit in New Orleans"</p>
            <input
              id="title" type="text" required value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Give your memory a title"
              style={inputStyle}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--amber)' }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)' }}
            />
          </div>

          {/* Media upload */}
          <div>
            <label style={labelStyle}>
              Photo or Video{' '}
              <span style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--secondary)' }}>(optional)</span>
            </label>
            <p style={hintStyle}>
              A photo or video makes your memory extra special — but a written story on its own is just as welcome.
              Upload one photo (JPG, PNG, HEIC) or video (MP4, MOV — max 200 MB). Images are auto-resized.
            </p>

            {preview ? (
              <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                {mediaKind === 'video' ? (
                  <video
                    src={preview}
                    controls
                    style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 4, border: '1px solid var(--border)', display: 'block' }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview} alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 4, border: '1px solid var(--border)', display: 'block' }}
                  />
                )}
                <button
                  type="button" onClick={removeFile}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%',
                    width: 32, height: 32, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: '#fff',
                  }}
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
                <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
                  {file?.name}
                </p>
              </div>
            ) : (
              <div
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragging ? 'var(--amber)' : 'var(--border)'}`,
                  borderRadius: 4, padding: '64px 32px', textAlign: 'center',
                  cursor: 'pointer', background: dragging ? 'var(--amber-light)' : '#FAFAF8',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 4, background: 'var(--amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ImagePlus size={22} color="var(--amber)" strokeWidth={1.5} />
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: 4, background: 'var(--amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Film size={22} color="var(--amber)" strokeWidth={1.5} />
                  </div>
                </div>
                <p style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 8, fontSize: '1.3rem' }}>
                  Drag and drop your photo or video here
                </p>
                <p style={{ fontSize: '1.15rem', color: 'var(--secondary)', marginBottom: 22 }}>
                  or click to browse your files
                </p>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', border: '1.5px solid var(--amber)',
                  borderRadius: 3, color: 'var(--amber)', fontSize: '1.15rem', fontWeight: 500,
                }}>
                  <Upload size={18} /> Choose File
                </span>
              </div>
            )}

            <input
              ref={fileInputRef} type="file"
              accept="image/*,video/mp4,video/mov,video/quicktime,video/webm"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" style={labelStyle}>
              Your Story <span style={{ color: 'var(--amber)' }}>*</span>
            </label>
            <p style={hintStyle}>Tell us about this moment. How do you know Steve? What does this memory mean to you?</p>
            <textarea
              id="description" required value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Write your memory here…"
              rows={6}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 220 }}
              onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--amber)' }}
              onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border)' }}
            />
          </div>

          {/* Relationship */}
          <div>
            <label style={labelStyle}>
              How do you know Steve? <span style={{ color: 'var(--amber)' }}>*</span>
            </label>
            <p style={hintStyle}>This helps visitors browse memories by relationship.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { value: 'family',    label: 'Family Member' },
                { value: 'friend',    label: 'Friend' },
                { value: 'colleague', label: 'Colleague / Industry' },
                { value: 'other',     label: 'Other' },
              ].map(opt => (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '18px 20px',
                    border: `2px solid ${relationship === opt.value ? 'var(--amber)' : 'var(--border)'}`,
                    borderRadius: 4,
                    background: relationship === opt.value ? 'var(--amber-light)' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontSize: '1.35rem',
                    fontWeight: relationship === opt.value ? 600 : 400,
                    color: relationship === opt.value ? 'var(--amber)' : 'var(--foreground)',
                  }}
                >
                  <input
                    type="radio"
                    name="relationship"
                    value={opt.value}
                    checked={relationship === opt.value}
                    onChange={() => setRelationship(opt.value)}
                    required
                    style={{ accentColor: 'var(--amber)', width: 20, height: 20, flexShrink: 0 }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" style={labelStyle}>
              Your Name <span style={{ color: 'var(--amber)' }}>*</span>
            </label>
            <input
              id="name" type="text" required value={name}
              onChange={e => setName(e.target.value)}
              placeholder="How you'd like to be credited"
              style={inputStyle}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--amber)' }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)' }}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" style={labelStyle}>
              Your Email <span style={{ color: 'var(--amber)' }}>*</span>
            </label>
            <p style={hintStyle}>Only used if we need to follow up. Never shared publicly.</p>
            <input
              id="email" type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={inputStyle}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--amber)' }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)' }}
            />
          </div>

          {/* Error */}
          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 3 }}>
              <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '0.97rem', color: '#DC2626', margin: 0 }}>{errorMsg}</p>
            </div>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit" disabled={status === 'uploading'} className="btn-primary"
              style={{ width: '100%', fontSize: '0.9rem', padding: '12px', opacity: status === 'uploading' ? 0.7 : 1, cursor: status === 'uploading' ? 'not-allowed' : 'pointer' }}
            >
              {status === 'uploading' ? 'Submitting…' : 'Submit Memory'}
            </button>
            <p style={{ fontSize: '1.25rem', color: 'var(--secondary)', textAlign: 'center', marginTop: 16 }}>
              Submissions are reviewed before appearing on the site.
            </p>
          </div>
        </form>
      </section>
    </>
  )
}
