import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
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
          className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-start gap-12 md:gap-16"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Hero photo */}
          <div
            className="fade-up"
            style={{
              flexShrink: 0,
              width: 320,
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
            }}
          >
            <Image
              src="/hero.jpg"
              alt="Steve Beal"
              width={320}
              height={420}
              priority
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Text */}
          <div style={{ maxWidth: 620, paddingTop: 12 }} className="fade-up">
            <span className="section-label">A Tribute · San Francisco</span>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(3.4rem, 6vw, 5.5rem)',
                fontWeight: 700,
                marginTop: 16,
                marginBottom: 0,
                lineHeight: 1.08,
                color: 'var(--foreground)',
              }}
            >
              Steve Beal
            </h1>
            <span className="amber-rule" style={{ marginBottom: 26, width: 72 }} />
            <p
              style={{
                fontSize: '1.35rem',
                fontStyle: 'italic',
                fontFamily: 'var(--font-serif)',
                color: 'var(--secondary)',
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              Whisky Hall of Fame · Master of Whisky · Mentor · Priest · Friend
            </p>
            <p
              style={{
                fontSize: '1.3rem',
                color: 'var(--secondary)',
                lineHeight: 1.85,
                marginBottom: 40,
              }}
            >
              For more than four decades, Steve Beal has moved through the world with a rare
              combination of intellectual depth, genuine warmth, and an unshakeable love for what he
              does. This is a space to celebrate that — and to hear from the people who know him best.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link href="/stories" className="btn-primary">Read the Stories</Link>
              <Link href="/add-memory" className="btn-secondary">Share a Memory</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="max-w-5xl mx-auto px-6 py-14 md:py-22">
        <span className="section-label">His Story</span>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
            marginTop: 14,
            marginBottom: 4,
          }}
        >
          A Life Worth Stopping to Read
        </h2>
        <span className="amber-rule" style={{ marginBottom: 36 }} />

        <div
          style={{ fontSize: '1.35rem', lineHeight: 1.9, color: 'var(--foreground)', maxWidth: '80ch' }}
          className="flex flex-col gap-7"
        >
          <p>
            Steve Beal was among the first of Diageo&apos;s Masters of Whisky — a designation earned not
            in a classroom but across decades of genuine passion, relentless curiosity, and the kind of
            expertise that can only come from living inside a subject. Based in San Francisco, he led
            Diageo&apos;s North American whiskey efforts and is one of the chief reasons Bulleit rose
            from relative obscurity to become a staple behind bars across the country.
          </p>
          <p>
            His career reads like a tour through the greatest names in whisky: Johnnie Walker, the
            Classic Malts, Bulleit Bourbon, George Dickel, Crown Royal, Bushmills, and Diageo&apos;s
            acclaimed Orphan Barrel project. Along the way, his mentor was Evan Cattanach — himself a
            Whisky Magazine Hall of Fame inductee — a lineage that speaks to where Steve sits in this world.
          </p>
          <p>
            But what sets Steve apart is not his résumé. It&apos;s what he did with it. He co-created
            the US Bartender&apos;s Guild Master Accreditation Program, investing his knowledge into the
            careers of an entire generation of bartenders. He wrote about spirits. He hosted a nationally
            syndicated radio program alongside Marcy Smothers and celebrity chef Guy Fieri. He gave the
            industry more than it gave him.
          </p>
          <p>
            A graduate of the University of Arizona, Steve is also an ordained Episcopal priest, holding
            graduate credentials in theology from Oxford University and a Master of Divinity from the
            Episcopal Church Divinity School of the Pacific. He is, in every sense, a man of genuine spirit.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ borderTop: '1px solid var(--border)' }}
        className="max-w-5xl mx-auto px-6 py-14 md:py-20 text-center"
      >
        <span className="section-label">Community</span>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            marginTop: 14,
            marginBottom: 16,
          }}
        >
          People He&apos;s Touched
        </h2>
        <p
          style={{
            fontSize: '1.3rem',
            color: 'var(--secondary)',
            maxWidth: 620,
            margin: '0 auto 40px',
            lineHeight: 1.85,
          }}
        >
          Steve&apos;s story does not belong only to him — it lives in the people he has mentored,
          encouraged, and celebrated over a lifetime. Browse what has been shared, or add your own.
        </p>
        <div className="flex flex-wrap gap-5 justify-center">
          <Link href="/stories" className="btn-primary">Stories &amp; Photographs</Link>
          <Link href="/add-memory" className="btn-secondary">Share Your Memory</Link>
        </div>
      </section>
    </>
  )
}
