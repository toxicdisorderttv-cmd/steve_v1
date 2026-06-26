import GalleryGrid from '@/components/GalleryGrid'
import Link from 'next/link'
import { Submission } from '@/lib/types'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function getApprovedSubmissions(): Promise<Submission[]> {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('submissions')
      .select('id, title, photo_url, photo_urls, description, submitter_name, created_at, media_type, relationship')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    if (error) {
      // photo_urls column may not exist yet — fall back without it
      const { data: d2 } = await db
        .from('submissions')
        .select('id, title, photo_url, description, submitter_name, created_at, media_type, relationship')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
      return (d2 ?? []) as Submission[]
    }
    return (data ?? []) as Submission[]
  } catch {
    return []
  }
}

export default async function StoriesPage() {
  const submissions = await getApprovedSubmissions()

  return (
    <>
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(to bottom, #F0E6D6 0%, var(--background) 100%)',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="dot-grid" />
        <div
          className="max-w-5xl mx-auto px-8 py-12 md:py-16"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <span className="section-label">From Those Who Know Him</span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.6rem, 5vw, 4rem)',
              fontWeight: 700,
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            Stories &amp; Photographs
          </h1>
          <span className="amber-rule" style={{ marginBottom: 18 }} />
          <p
            style={{
              fontSize: '1.25rem',
              color: 'var(--secondary)',
              maxWidth: 620,
              lineHeight: 1.75,
              marginBottom: 28,
            }}
          >
            Every person below has been touched by Steve in some way — a career nudged,
            a glass shared, a lesson remembered. These are their stories.
          </p>
          <Link href="/add-memory" className="btn-primary">
            Share Your Memory
          </Link>
        </div>
      </section>

      {/* Gallery — full width, minimal padding */}
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        {submissions.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 24px',
              border: '1px dashed var(--border)',
              borderRadius: 6,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.7rem',
                color: 'var(--secondary)',
                marginBottom: 24,
              }}
            >
              The first story is waiting to be told.
            </p>
            <Link href="/add-memory" className="btn-primary">
              Be the First to Share
            </Link>
          </div>
        ) : (
          <>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--secondary)',
                marginBottom: 20,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {`${submissions.length} ${submissions.length === 1 ? 'memory' : 'memories'} shared · click any card to expand`}
            </p>
            <GalleryGrid submissions={submissions} />
          </>
        )}
      </section>
    </>
  )
}
