import Link from 'next/link';

const pillars = [
  {
    slug: 'health-safety-risk-assessment',
    title: 'Health & Safety Risk Assessment',
    summary:
      'MHSWR 1999 framework, SFAIRP under Edwards v National Coal Board, the hierarchy of control, and the specific-regulation interface.',
    live: true,
  },
  {
    slug: 'fire-risk-assessment',
    title: 'Fire Risk Assessment',
    summary:
      'PAS 79-1:2020 methodology, BSA 2022 implications, competence requirements, and case law.',
    live: true,
  },
  {
    slug: 'pat-testing',
    title: 'PAT Testing',
    summary: 'IET Code of Practice 5th Edition, the three-tier inspection regime, and Class I/II/III testing protocols.',
    live: true,
  },
  {
    slug: 'legionella',
    title: 'Legionella Risk Assessment',
    summary: 'HSG274 Parts 1-3, L8 ACoP, BS 8580-1, sentinel methodology, and TMV/expansion vessel management.',
    live: true,
  },
  {
    slug: 'fire-alarms',
    title: 'Fire Alarm Systems',
    summary: 'BS 5839-1:2017+A2:2023, system categories, design, commissioning, UAS reduction, and integration testing.',
    live: true,
  },
  {
    slug: 'emergency-lighting',
    title: 'Emergency Lighting',
    summary: 'BS 5266-1:2016, BS EN 1838 illuminance levels, BS EN 50172 testing regime, and design verification.',
    live: true,
  },
  {
    slug: 'electrical-testing',
    title: 'Electrical (EICR)',
    summary: 'BS 7671:2018+A2:2022, EICR coding including the C3 question, IET GN3 frequency framework.',
    live: true,
  },
  {
    slug: 'gas-safety',
    title: 'Gas Safety',
    summary: 'GSIUR 1998 Regulation 35/36 distinction, ACS qualifications by category, IUSP, and BS 6173 kitchen interlocks.',
    live: true,
  },
  {
    slug: 'asbestos',
    title: 'Asbestos Management',
    summary: 'CAR 2012, HSG264 survey methodology, the three work categories, and contractor management.',
    live: true,
  },
  {
    slug: 'fire-extinguishers',
    title: 'Fire Extinguishers',
    summary: 'BS 5306-8:2023 selection, BS 5306-3:2017 maintenance, BS EN 3 classification, and the Class F kitchen requirement.',
    live: true,
  },
  {
    slug: 'workplace-safety-training',
    title: 'Workplace Safety Training',
    summary: 'MHSWR Regulation 13, specific-regulation training duties, the IOSH/NEBOSH competence framework, and refresher methodology.',
    live: true,
  },
];

export default function ProfessionalsHomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <section className="mb-24 max-w-3xl">
        <p
          className="mb-4"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'var(--bcg-sage)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          For Professionals
        </p>
        <h1
          className="text-ink mb-8"
          style={{
            fontSize: '60px',
            lineHeight: '1.1',
            letterSpacing: '-0.025em',
            fontWeight: 700,
          }}
        >
          Technical reference for UK compliance practitioners.
        </h1>
        <p
          className="text-ink mb-6"
          style={{ fontSize: '22px', lineHeight: '1.55', maxWidth: '32em' }}
        >
          PAS, BS, ACoP, HSG and case law references for fire risk assessors, facilities
          managers, and accountable persons of complex premises.
        </p>
        <p
          className="text-stone"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
          }}
        >
          Looking for plain-English answers?{' '}
          <Link href="/" className="text-sage underline underline-offset-4">
            Visit the For Everyone section
          </Link>
        </p>
      </section>

      <section>
        <h2
          className="text-ink mb-12"
          style={{ fontSize: '32px', lineHeight: '1.2', fontWeight: 600 }}
        >
          Technical topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
          {pillars.map((p) =>
            p.live ? (
              <Link
                key={p.slug}
                href={`/${p.slug}/professional`}
                className="block py-7 border-b border-mist hover:bg-note transition-colors"
                style={{ textDecoration: 'none', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
              >
                <h3
                  className="text-ink mb-2"
                  style={{ fontSize: '22px', lineHeight: '1.3', fontWeight: 600 }}
                >
                  {p.title}
                </h3>
                <p className="text-stone" style={{ fontSize: '16px', lineHeight: '1.55' }}>
                  {p.summary}
                </p>
              </Link>
            ) : (
              <div
                key={p.slug}
                className="block py-7 border-b border-mist opacity-50"
                style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
              >
                <h3
                  className="text-ink mb-2"
                  style={{ fontSize: '22px', lineHeight: '1.3', fontWeight: 600 }}
                >
                  {p.title}
                </h3>
                <p className="text-stone mb-2" style={{ fontSize: '16px', lineHeight: '1.55' }}>
                  {p.summary}
                </p>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: 'var(--bcg-stone)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Coming soon
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
