import Link from 'next/link'
import Image from 'next/image'
import { supabaseAdmin } from '@/lib/supabase'
import { HERO_IMAGE } from '@/lib/config'
import PhotoArchive from '@/components/PhotoArchive'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let memoryCount = 0
  try {
    const db = supabaseAdmin()
    const { count } = await db
      .from('submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
    memoryCount = count ?? 0
  } catch { /* graceful fallback — page renders without count */ }

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
          className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row md:items-center gap-10 md:gap-16"
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
              boxShadow: '0 6px 18px rgba(0,0,0,0.10)',
            }}
          >
            <Image
              src={HERO_IMAGE}
              alt="Steve Beal"
              width={260}
              height={339}
              priority
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 12 }} className="fade-up">
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

          {/* Quaich photo — right side, desktop only */}
          <div
            className="fade-up hidden md:block"
            style={{
              flexShrink: 0,
              width: 250,
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.10)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/quaich.jpg"
              alt="Steve Beal at the Keeper of the Quaich ceremony, Scotland"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: '#FAF5EE', borderBottom: '1px solid var(--border)' }}>
        <style>{`
          .tl-wrap { display:flex; flex-wrap:wrap; justify-content:center; }
          .tl-node { display:flex; flex-direction:column; align-items:center; text-align:center; padding:40px 24px; flex:1; min-width:130px; }
          .tl-node:not(:last-child) { border-right:1px solid var(--border); }
          @media(max-width:640px){
            .tl-node { min-width:48%; flex:none; border-right:none; border-bottom:1px solid var(--border); }
            .tl-node:nth-child(odd){ border-right:1px solid var(--border); }
          }
        `}</style>
        <div className="max-w-6xl mx-auto px-4">
          <div style={{ textAlign:'center', paddingTop: 40, paddingBottom: 8 }}>
            <span className="section-label">Career Arc</span>
            <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.6rem,2.5vw,2rem)', marginTop:10, marginBottom:4 }}>
              A Life in Full
            </h2>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>
              <span className="amber-rule" />
            </div>
          </div>
          <div className="tl-wrap">

            {/* University of Arizona */}
            <div className="tl-node">
              <svg viewBox="0 0 80 90" width="52" height="52" aria-label="University of Arizona">
                <path d="M40 4L76 86H62L55 66H25L18 86H4L40 4Z" fill="#AB0520"/>
                <path d="M40 22L52 56H28Z" fill="white"/>
              </svg>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--amber)', textTransform:'uppercase', letterSpacing:'0.09em', marginTop:14 }}>Education</span>
              <span style={{ fontFamily:'var(--font-serif)', fontSize:'0.9rem', fontWeight:700, color:'var(--foreground)', marginTop:5, lineHeight:1.3 }}>University of Arizona</span>
              <span style={{ fontSize:'0.76rem', color:'var(--secondary)', marginTop:3 }}>Tucson</span>
            </div>

            {/* University of Oxford */}
            <div className="tl-node">
              <svg viewBox="0 0 66 80" width="44" height="54" aria-label="University of Oxford">
                <path d="M4 4H62V52Q33 80 33 80Q33 80 4 52Z" fill="#002147"/>
                <rect x="16" y="18" width="34" height="24" rx="2" fill="#F5EDD6"/>
                <line x1="33" y1="18" x2="33" y2="42" stroke="#002147" strokeWidth="2"/>
                <line x1="19" y1="25" x2="31" y2="25" stroke="#8B7355" strokeWidth="1.2"/>
                <line x1="19" y1="29" x2="31" y2="29" stroke="#8B7355" strokeWidth="1.2"/>
                <line x1="19" y1="33" x2="31" y2="33" stroke="#8B7355" strokeWidth="1.2"/>
                <line x1="35" y1="25" x2="47" y2="25" stroke="#8B7355" strokeWidth="1.2"/>
                <line x1="35" y1="29" x2="47" y2="29" stroke="#8B7355" strokeWidth="1.2"/>
                <line x1="35" y1="33" x2="47" y2="33" stroke="#8B7355" strokeWidth="1.2"/>
              </svg>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--amber)', textTransform:'uppercase', letterSpacing:'0.09em', marginTop:14 }}>Theology</span>
              <span style={{ fontFamily:'var(--font-serif)', fontSize:'0.9rem', fontWeight:700, color:'var(--foreground)', marginTop:5, lineHeight:1.3 }}>University of Oxford</span>
              <span style={{ fontSize:'0.76rem', color:'var(--secondary)', marginTop:3 }}>England</span>
            </div>

            {/* Episcopal Ordination */}
            <div className="tl-node">
              <svg viewBox="0 0 58 70" width="42" height="52" aria-label="Ordained Priest">
                <path d="M4 4H54V48Q29 70 29 70Q29 70 4 48Z" fill="#003087"/>
                <rect x="25" y="12" width="8" height="38" fill="white" rx="1"/>
                <rect x="10" y="26" width="38" height="8" fill="white" rx="1"/>
              </svg>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--amber)', textTransform:'uppercase', letterSpacing:'0.09em', marginTop:14 }}>Ordained</span>
              <span style={{ fontFamily:'var(--font-serif)', fontSize:'0.9rem', fontWeight:700, color:'var(--foreground)', marginTop:5, lineHeight:1.3 }}>Episcopal Priest</span>
              <span style={{ fontSize:'0.76rem', color:'var(--secondary)', marginTop:3 }}>Grace Cathedral, SF</span>
            </div>

            {/* Keeper of the Quaich 2010 */}
            <div className="tl-node">
              <svg viewBox="0 0 80 44" width="64" height="36" aria-label="Keeper of the Quaich">
                <ellipse cx="40" cy="10" rx="22" ry="7" fill="none" stroke="#92400E" strokeWidth="3"/>
                <path d="M18 12Q18 30 40 32Q62 30 62 12" fill="none" stroke="#92400E" strokeWidth="3"/>
                <line x1="18" y1="10" x2="6" y2="10" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round"/>
                <line x1="6" y1="10" x2="6" y2="16" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round"/>
                <line x1="62" y1="10" x2="74" y2="10" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round"/>
                <line x1="74" y1="10" x2="74" y2="16" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--amber)', textTransform:'uppercase', letterSpacing:'0.09em', marginTop:14 }}>2010</span>
              <span style={{ fontFamily:'var(--font-serif)', fontSize:'0.9rem', fontWeight:700, color:'var(--foreground)', marginTop:5, lineHeight:1.3 }}>Keeper of the Quaich</span>
              <span style={{ fontSize:'0.76rem', color:'var(--secondary)', marginTop:3 }}>Blair Castle, Scotland</span>
            </div>

            {/* Whisky Hall of Fame 2015 */}
            <div className="tl-node">
              <svg viewBox="0 0 60 68" width="44" height="52" aria-label="Whisky Hall of Fame">
                <path d="M14 6H46Q52 6 52 20Q52 38 30 46Q8 38 8 20Q8 6 14 6Z" fill="none" stroke="#D97706" strokeWidth="3"/>
                <path d="M8 10Q2 10 2 20Q2 28 8 28" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M52 10Q58 10 58 20Q58 28 52 28" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="30" y1="46" x2="30" y2="56" stroke="#D97706" strokeWidth="3"/>
                <line x1="18" y1="56" x2="42" y2="56" stroke="#D97706" strokeWidth="3" strokeLinecap="round"/>
                <text x="30" y="32" textAnchor="middle" fill="#D97706" fontSize="16">★</text>
              </svg>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--amber)', textTransform:'uppercase', letterSpacing:'0.09em', marginTop:14 }}>2015</span>
              <span style={{ fontFamily:'var(--font-serif)', fontSize:'0.9rem', fontWeight:700, color:'var(--foreground)', marginTop:5, lineHeight:1.3 }}>Whisky Hall of Fame</span>
              <span style={{ fontSize:'0.76rem', color:'var(--secondary)', marginTop:3 }}>Whisky Magazine, London</span>
            </div>

            {/* USBG Lifetime Achievement 2016 */}
            <div className="tl-node">
              <svg viewBox="0 0 60 72" width="44" height="52" aria-label="USBG Lifetime Achievement">
                <path d="M22 4L30 20L38 4" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinejoin="round"/>
                <circle cx="30" cy="48" r="22" fill="none" stroke="#D97706" strokeWidth="3"/>
                <circle cx="30" cy="48" r="15" fill="none" stroke="#D97706" strokeWidth="1.5"/>
                <text x="30" y="54" textAnchor="middle" fill="#D97706" fontSize="16">★</text>
              </svg>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--amber)', textTransform:'uppercase', letterSpacing:'0.09em', marginTop:14 }}>2016</span>
              <span style={{ fontFamily:'var(--font-serif)', fontSize:'0.9rem', fontWeight:700, color:'var(--foreground)', marginTop:5, lineHeight:1.3 }}>Lifetime Achievement</span>
              <span style={{ fontSize:'0.76rem', color:'var(--secondary)', marginTop:3 }}>US Bartenders&apos; Guild</span>
            </div>

            {/* SFWSC 2022 */}
            <div className="tl-node">
              <svg viewBox="0 0 60 60" width="44" height="44" aria-label="SFWSC Lifetime Achievement">
                <path d="M30 4L36 21L53 22L40 33L44 50L30 41L16 50L20 33L7 22L24 21Z" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--amber)', textTransform:'uppercase', letterSpacing:'0.09em', marginTop:14 }}>2022</span>
              <span style={{ fontFamily:'var(--font-serif)', fontSize:'0.9rem', fontWeight:700, color:'var(--foreground)', marginTop:5, lineHeight:1.3 }}>Lifetime Achievement</span>
              <span style={{ fontSize:'0.76rem', color:'var(--secondary)', marginTop:3 }}>SF World Spirits Competition</span>
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
            Steve Beal is among the most respected whisky authorities in America. The first of only fifteen
            people ever named a Diageo Master of Whisky — a designation earned not in a classroom but
            across decades of genuine passion, relentless curiosity, and the kind of expertise that
            can only come from living inside a subject. For more than fifteen years he led Diageo&apos;s
            whisky education on the US West Coast, based out of his home in San Francisco.
          </p>
          <p>
            His career reads like a tour through the greatest names in the spirit world: the Classic
            Malts of Scotland, Johnnie Walker, Bulleit Bourbon and Rye, George Dickel Tennessee Whisky,
            Crown Royal Canadian Whisky, and Bushmills Irish Whiskey. His legacy with Bulleit is
            memorialised at the distillery in Shelbyville, Kentucky, where his portrait hangs alongside
            a plaque reading &ldquo;Pioneer of Market Expansion.&rdquo; He is the founding member and
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
            him with its inaugural Lifetime Achievement Award. He has judged more than 25
            international spirits competitions — including the San Francisco World Spirits
            Competition since its founding in 2000, the International Wine &amp; Spirit Competition
            as a Chairing Judge, and the World Whisky Awards as US Chair for American Whiskies.
            In 2024, he was appointed Panel Chair of the International Whisky Competition.
          </p>
          <p>
            A graduate of the University of Arizona, Steve is also an ordained Episcopal priest. He
            holds graduate credentials in theology from Oxford University and a Master of Divinity
            from the Church Divinity School of the Pacific in Berkeley. He has served as an assisting
            priest at Grace Cathedral on Nob Hill in San Francisco for the last 25 years. He is, in every sense, a man of
            genuine spirit.
          </p>
        </div>
      </section>

      {/* Photo Archive */}
      <section style={{ borderTop: '1px solid var(--border)', background: '#FAF5EE' }}>
        <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">
          <span className="section-label">From the Archive</span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              marginTop: 14,
              marginBottom: 4,
            }}
          >
            A Life in Photographs
          </h2>
          <span className="amber-rule" style={{ marginBottom: 28 }} />
          <PhotoArchive />
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

        <style>{`
          .press-card { border: 1px solid var(--border); border-radius: 5px; padding: 24px 26px; height: 100%; transition: border-color 0.15s, box-shadow 0.15s; background: #fff; }
          .press-card:hover { border-color: var(--amber); box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
          .press-link { text-decoration: none; color: inherit; display: block; }
        `}</style>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="https://californiafreemason.org/2021/03/22/the-spirit-guide/"
            target="_blank"
            rel="noopener noreferrer"
            className="press-link"
          >
            <article className="press-card">
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
            className="press-link"
          >
            <article className="press-card">
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

          <a
            href="https://whiskycast.com/whisky-magazine-names-3-to-hall-of-fame/"
            target="_blank"
            rel="noopener noreferrer"
            className="press-link"
          >
            <article className="press-card">
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                WhiskyCast · February 2015
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, margin: '10px 0 10px', lineHeight: 1.25 }}>
                &ldquo;Whisky Magazine Names 3 to Hall of Fame&rdquo;
              </h3>
              <p style={{ fontSize: '0.93rem', color: 'var(--secondary)', lineHeight: 1.7, margin: 0 }}>
                Coverage of Steve&apos;s 2015 induction into the Whisky Magazine Hall of Fame alongside Bill Samuels Jr. of Maker&apos;s Mark and Al Young of Four Roses.
              </p>
              <span style={{ display: 'inline-block', marginTop: 16, fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>
                Read article →
              </span>
            </article>
          </a>

          <a
            href="https://www.whiskycompetition.com/tastingpanel/charles-maclean"
            target="_blank"
            rel="noopener noreferrer"
            className="press-link"
          >
            <article className="press-card">
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                International Whisky Competition
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, margin: '10px 0 10px', lineHeight: 1.25 }}>
                &ldquo;Steve Beal — Tasting Panel&rdquo;
              </h3>
              <p style={{ fontSize: '0.93rem', color: 'var(--secondary)', lineHeight: 1.7, margin: 0 }}>
                His official profile as a judge for the International Whisky Competition — recognising him as one of the world&apos;s most trusted spirits specialists with decades of high-level industry expertise.
              </p>
              <span style={{ display: 'inline-block', marginTop: 16, fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>
                View profile →
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
        {memoryCount > 0 && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--amber)', marginBottom: 16, marginTop: 0 }}>
            {memoryCount} {memoryCount === 1 ? 'memory' : 'memories'} shared so far
          </p>
        )}
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
