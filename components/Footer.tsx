export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--background)',
        marginTop: 'auto',
      }}
    >
      <div
        className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--foreground)' }}>
          Steve Beal
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', textAlign: 'center' }}>
          A celebration of a remarkable life, shared by those who know him best.
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>
          &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}
