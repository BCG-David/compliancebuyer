import Link from 'next/link';
import GuideHero from '@/components/GuideHero';

const pillars = [
  { slug: 'fire-risk-assessment', title: 'Fire Risk Assessment', summary: "When you need one, who can do it, what it should cover, and what happens if you don't have it." },
  { slug: 'pat-testing', title: 'PAT Testing', summary: 'Portable appliance testing: the law, the frequency, and what a real certificate looks like.' },
  { slug: 'legionella', title: 'Legionella Risk Assessment', summary: 'L8 ACoP, water system duties, and what landlords and businesses must do.' },
  { slug: 'fire-alarms', title: 'Fire Alarm Systems', summary: 'BS 5839 categories, servicing intervals, weekly tests, and choosing the right system.' },
  { slug: 'emergency-lighting', title: 'Emergency Lighting', summary: 'BS 5266-1, the 3-hour rule, monthly and annual tests, and battery replacement.' },
  { slug: 'electrical-testing', title: 'Electrical (EICR)', summary: 'Fixed wire testing, BS 7671, EICR codes (C1/C2/C3) and what landlords must do.' },
  { slug: 'gas-safety', title: 'Gas Safety', summary: 'Landlord CP12, commercial gas inspections, Gas Safe Register, and CO alarms.' },
  { slug: 'asbestos', title: 'Asbestos Management', summary: 'CAR 2012 duty to manage, surveys, registers, and licensed vs non-licensed work.' },
  { slug: 'fire-extinguishers', title: 'Fire Extinguishers', summary: 'BS 5306, types of extinguisher, servicing intervals, and when to replace.' },
  { slug: 'workplace-safety-training', title: 'Workplace Safety Training', summary: 'First aid, fire marshal, manual handling, working at height, DSE, and IOSH/NEBOSH.' },
];

const sectors = [
  { slug: 'restaurants', label: 'Restaurants & cafés' },
  { slug: 'retail', label: 'Retail & shops' },
  { slug: 'hotels', label: 'Hotels & hospitality' },
  { slug: 'schools', label: 'Schools & education' },
  { slug: 'offices', label: 'Offices' },
];

export default function HomePage() {
  return (
    <>
      <GuideHero />

      {/* Tagline band — risk-tolerance position, directly under hero */}
      <section style={{ background: 'var(--cb-ink-800)' }} className="on-ink">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-3"
          style={{ fontFamily: 'Inter, sans-serif' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.01em' }}>Your business.</span>
          <span style={{ color: 'var(--cb-signal)', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.01em' }}>Your risk.</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.01em' }}>Your decision.</span>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Sectors teaser — how a buyer actually thinks */}
        <section className="mb-24">
          <p className="mb-3" style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--cb-signal-dark)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
            Start with your world
          </p>
          <h2 className="text-ink mb-4" style={{ fontSize: '36px', lineHeight: 1.15, fontWeight: 800, letterSpacing: '-0.02em' }}>
            What does your kind of business need?
          </h2>
          <p className="mb-8" style={{ fontSize: '18px', lineHeight: 1.6, color: 'var(--cb-slate)', maxWidth: '40em' }}>
            Compliance isn’t organised the way you think about your business. Start from what you
            actually run, and see the obligations that apply to you — in plain English.
          </p>
          <div className="flex flex-wrap gap-3">
            {sectors.map((s) => (
              <Link key={s.slug} href={`/sectors/${s.slug}`}
                className="cb-card"
                style={{ textDecoration: 'none', padding: '14px 20px', display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '16px', color: 'var(--cb-ink)' }}>
                {s.label}
                <span style={{ color: 'var(--cb-signal-dark)' }}>→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Start here — H&S Risk Assessment as the gateway pillar */}
        <section className="mb-24">
          <p className="mb-4" style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--cb-signal-dark)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
            Start Here
          </p>
          <Link href="/health-safety-risk-assessment" className="block cb-card-signal" style={{ textDecoration: 'none', maxWidth: '48rem' }}>
            <h2 className="text-ink mb-4" style={{ fontSize: '30px', lineHeight: 1.2, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Health &amp; Safety Risk Assessment
            </h2>
            <p className="text-ink mb-5" style={{ fontSize: '18px', lineHeight: 1.6 }}>
              The starting point for everything else. The general duty to assess and manage risk
              underpins every specific assessment your business needs — fire, water, electrical,
              chemicals, and the rest.
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 700, color: 'var(--cb-signal-dark)' }}>
              Read the guide →
            </p>
          </Link>
        </section>

        {/* Specific topics */}
        <section>
          <h2 className="text-ink mb-3" style={{ fontSize: '36px', lineHeight: 1.15, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Every compliance topic, explained properly
          </h2>
          <p className="mb-12" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'var(--cb-slate)' }}>
            Each topic has a plain-English guide and a technical version. Looking for the regulatory detail?{' '}
            <Link href="/for-professionals" style={{ color: 'var(--cb-signal-dark)', fontWeight: 600 }}>Visit the Professionals section →</Link>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1">
            {pillars.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`}
                className="block py-7 hover:bg-cloud transition-colors"
                style={{ textDecoration: 'none', borderBottom: '1px solid var(--cb-line)', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                <h3 className="text-ink mb-2" style={{ fontSize: '22px', lineHeight: 1.3, fontWeight: 700 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '16px', lineHeight: 1.55, color: 'var(--cb-slate)' }}>{p.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
