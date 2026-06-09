import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compliance by Sector',
  description:
    'Find the UK workplace compliance obligations that apply to your kind of business — restaurants, retail, hotels, schools, and offices — explained in plain English.',
};

const sectors = [
  {
    slug: 'restaurants',
    label: 'Restaurants & cafés',
    blurb: 'Commercial kitchens, gas, hot oil, public access — the highest-risk small-business setting, and the obligations that come with it.',
    risk: 'Higher risk',
  },
  {
    slug: 'retail',
    label: 'Retail & shops',
    blurb: 'Public premises, electrical loads, fire escape routes, and the assessments a shop floor actually needs.',
    risk: 'Moderate risk',
  },
  {
    slug: 'hotels',
    label: 'Hotels & hospitality',
    blurb: 'Sleeping accommodation changes everything — fire, legionella, and assessment depth all step up.',
    risk: 'Higher risk',
  },
  {
    slug: 'schools',
    label: 'Schools & education',
    blurb: 'Vulnerable occupants, asbestos in older buildings, and a broad training and assessment burden.',
    risk: 'Higher risk',
  },
  {
    slug: 'offices',
    label: 'Offices',
    blurb: 'Often called "low risk" — but the familiar obligations still apply, and a few quietly catch people out.',
    risk: 'Lower risk',
  },
];

export default function SectorsIndex() {
  return (
    <>
      <section className="on-ink" style={{ background: 'var(--cb-ink)' }}>
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14">
          <p style={{ fontSize: '13px', color: 'var(--cb-signal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', fontWeight: 600 }}>
            Start with your world
          </p>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.025em', fontWeight: 800, color: '#fff', margin: 0, maxWidth: '16ch' }}>
            What does your kind of business actually need?
          </h1>
          <p style={{ fontSize: '19px', lineHeight: 1.55, color: 'rgba(255,255,255,0.72)', maxWidth: '40em', marginTop: '20px' }}>
            Compliance isn’t organised the way you think about your business. Start from what you
            actually run, and see the obligations that apply to you — in plain English, with an
            honest note on what each involves.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sectors.map((s) => (
            <Link key={s.slug} href={`/sectors/${s.slug}`} className="cb-card hover:bg-cloud transition-colors" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 700, color: 'var(--cb-ink)' }}>{s.label}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--cb-signal-dark)', whiteSpace: 'nowrap' }}>{s.risk}</span>
              </div>
              <p style={{ fontSize: '16px', lineHeight: 1.55, color: 'var(--cb-slate)', margin: '0 0 12px' }}>{s.blurb}</p>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 700, color: 'var(--cb-signal-dark)' }}>See what applies →</span>
            </Link>
          ))}
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'var(--cb-slate)', marginTop: '32px' }}>
          Don’t see your sector, or run something more unusual?{' '}
          <Link href="/ask-guide" style={{ color: 'var(--cb-signal-dark)', fontWeight: 600 }}>Ask The Guide directly →</Link>
        </p>
      </div>
    </>
  );
}
