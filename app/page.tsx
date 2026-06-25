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
              width: 260,
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
            }}
          >
            <Image
              src="/hero.jpg"
              alt="Steve Beal"
              width={260}
              height={340}
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
              Keeper of the Quaich · Whisky Hall of Fame · Ordained Priest · Mentor · Friend
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
            Steve Beal is among the most respected whisky authorities in America. One of only fifteen
            people ever named a Diageo Master of Whisky — a designation earned not in a classroom but
            across decades of genuine passion, relentless curiosity, and the kind of expertise that
            can only come from living inside a subject. For more than fifteen years he led Diageo&apos;s
            whisky education on the US West Coast, based out of his home in San Francisco.
          </p>
          <p>
            His career reads like a tour through the greatest names in the spirit world: the Classic
            Malts of Scotland, Johnnie Walker, Bulleit Bourbon and Rye, George Dickel Tennessee Whisky,
            Crown Royal Canadian Whisky, and Bushmills Irish Whiskey. He is the founding member and
            Senior Consultant of International Drinks Specialists, and his mentor was Evan
            Cattanach — himself a Whisky Magazine Hall of Fame inductee — a lineage that speaks to
            exactly where Steve sits in this world.
          </p>
          <p>
            But what sets Steve apart is not his résumé. It&apos;s what he did with it. He co-founded
            the US Bartenders&apos; Guild Master Accreditation Program, investing his knowledge into
            the careers of an entire generation of bartenders. He served as contributing editor to
            Patterson&apos;s California Beverage Journal and The Tasting Panel Magazine, and hosted a
            nationally syndicated radio program alongside Marcy Smothers and celebrity chef Guy Fieri,
            bringing the joy of food and drink to audiences across the country. He gave the industry
            more than it gave him.
          </p>
          <p>
            The honors followed. In 2010 he was created a{' '}
            <em>Keeper of the Quaich</em> at Blair Castle in Scotland — an honor reserved only for the
            elite of the Scotch Whisky world. In 2015, Whisky Magazine inducted him into its Hall of
            Fame, making him the 25th person ever to receive that distinction, alongside Al Young of
            Four Roses and Bill Samuels Jr. of Maker&apos;s Mark. In 2016, at the Tales of the Cocktail
            Spirited Awards in New Orleans, the US Bartenders&apos; Guild honored him with its
            Lifetime Achievement Award. In 2022, the San Francisco World Spirits Competition honored
            him with its inaugural Lifetime Achievement Award. He has judged international spirits
            competitions for more than two decades — including the San Francisco World Spirits
            Competition since its founding in 2000, the International Wine &amp; Spirit Competition
            as a Chairing Judge, and the World Whisky Awards as US Chair for American Whiskies.
          </p>
          <p>
            A graduate of the University of Arizona, Steve is also an ordained Episcopal priest. He
            holds graduate credentials in theology from Oxford University and a Master of Divinity
            from the Church Divinity School of the Pacific in Berkeley. He has served as an assisting
            priest at Grace Cathedral on Nob Hill in San Francisco. He is, in every sense, a man of
            genuine spirit.
          </p>
        </div>
      </section>

      {/* Press & Writing */}
      <section style={{ borderTop: '1px solid var(--border)' }} className="max-w-5xl mx-auto px-6 py-14">
        <span className="section-label">In the Press</span>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            marginTop: 14,
            marginBottom: 4,
          }}
        >
          Featured &amp; Written
        </h2>
        <span className="amber-rule" style={{ marginBottom: 36 }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="https://californiafreemason.org/2021/03/22/the-spirit-guide/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <article
              style={{
                border: '1px solid var(--border)',
                borderRadius: 5,
                padding: '24px 26px',
                height: '100%',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                background: '#fff',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--amber)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                California Freemason Magazine · March 2021
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, margin: '10px 0 10px', lineHeight: 1.25 }}>
                &ldquo;The Spirit Guide&rdquo;
              </h3>
              <p style={{ fontSize: '0.93rem', color: 'var(--secondary)', lineHeight: 1.7, margin: 0 }}>
                A profile on how Steve bridges his two callings — whisky mastery and the Episcopal priesthood — and why he sees them as the same pursuit.
              </p>
              <span style={{ display: 'inline-block', marginTop: 16, fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>
                Read article →
              </span>
            </article>
          </a>

          <a
            href="https://www.barandrestaurant.com/operations/scoop-scotch-steven-beal"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <article
              style={{
                border: '1px solid var(--border)',
                borderRadius: 5,
                padding: '24px 26px',
                height: '100%',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                background: '#fff',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--amber)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Bar &amp; Restaurant Magazine
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, margin: '10px 0 10px', lineHeight: 1.25 }}>
                &ldquo;The Scoop on Scotch with Steven Beal&rdquo;
              </h3>
              <p style={{ fontSize: '0.93rem', color: 'var(--secondary)', lineHeight: 1.7, margin: 0 }}>
                Steven Beal on the craft of Scotch whisky, what separates an exceptional dram, and how to share that knowledge with guests.
              </p>
              <span style={{ display: 'inline-block', marginTop: 16, fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>
                Read article →
              </span>
            </article>
          </a>
        </div>

        <p style={{ marginTop: 28, fontSize: '0.95rem', color: 'var(--secondary)', lineHeight: 1.7 }}>
          Steve has also served as contributing editor to{' '}
          <em>Patterson&apos;s California Beverage Journal</em> and{' '}
          <em>The Tasting Panel Magazine</em>.
        </p>
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
