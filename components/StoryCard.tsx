import Image from 'next/image'
import { Submission } from '@/lib/types'
import { User } from 'lucide-react'

interface StoryCardProps {
  submission: Submission
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm|ogg|avi|m4v|quicktime)(\?|$)/i.test(url)
}

export default function StoryCard({ submission }: StoryCardProps) {
  const video = (submission.media_type === 'video') || isVideoUrl(submission.photo_url)

  return (
    <article
      className="card-lift"
      style={{
        background: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: 5,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Media */}
      <div
        className={video ? '' : 'photo-wrap'}
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: video ? '0' : '65%',
          background: '#E8DDD0',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {video ? (
          <video
            src={submission.photo_url}
            controls
            playsInline
            style={{ width: '100%', display: 'block', maxHeight: 300, objectFit: 'cover' }}
          />
        ) : (
          <Image
            src={submission.photo_url}
            alt={submission.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.4rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: 'var(--foreground)',
            margin: 0,
          }}
        >
          {submission.title}
        </h3>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--secondary)',
            lineHeight: 1.8,
            margin: 0,
            flex: 1,
          }}
        >
          {submission.description}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'var(--amber-light)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <User size={18} color="var(--amber)" strokeWidth={1.5} />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--foreground)' }}>
            {submission.submitter_name}
          </span>
        </div>
      </div>
    </article>
  )
}
