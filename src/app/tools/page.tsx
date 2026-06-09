import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free UK Compliance Tools',
  description:
    'Free tools to help with UK workplace compliance: compliance check diagnostic, first aider calculator, fire extinguisher calculator, PAT testing volume estimator, and EICR cost estimator.',
};

const tools = [
  {
    slug: 'compliance-check',
    title: 'Compliance Check',
    summary:
      "Answer 6 questions to find out which UK compliance areas apply to your business. The best place to start if you're not sure what you need.",
    live: true,
    badge: 'Most popular',
  },
  {
    slug: 'first-aider',
    title: 'First Aider Calculator',
    summary:
      'How many first aiders does your business need? Based on size, risk level, and shift patterns.',
    live: true,
  },
  {
    slug: 'fire-extinguisher',
    title: 'Fire Extinguisher Calculator',
    summary:
      'How many fire extinguishers do you need, and what types? Based on floor area and use class.',
    live: true,
  },
  {
    slug: 'pat-testing',
    title: 'PAT Testing Volume Estimator',
    summary:
      'Estimate how many appliances need PAT testing in your business. Based on industry type and headcount.',
    live: true,
  },
  {
    slug: 'eicr',
    title: 'EICR Cost Estimator',
    summary:
      'Estimated cost of an EICR (electrical installation condition report) for your premises.',
    live: true,
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-prose mx-auto px-6 py-20">
      <p
        className="mb-8"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: 'var(--bcg-sage)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        Free Tools
      </p>

      <header className="mb-14">
        <h1
          className="text-ink mb-6"
          style={{
            fontSize: '52px',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            fontWeight: 700,
          }}
        >
          UK compliance tools &mdash; fast answers to the most common questions.
        </h1>
        <p className="text-stone" style={{ fontSize: '21px', lineHeight: '1.6' }}>
          No sign-up. No email. Just useful calculators built on UK regulations and practitioner
          experience.
        </p>
      </header>

      <section>
        <div className="grid grid-cols-1 gap-0">
          {tools.map((t) =>
            t.live ? (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="block py-8 border-b border-mist hover:bg-note transition-colors"
                style={{ textDecoration: 'none' }}
              >
                {t.badge && (
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: 'var(--bcg-sage)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    {t.badge}
                  </p>
                )}
                <h3
                  className="text-ink mb-2"
                  style={{ fontSize: '24px', lineHeight: '1.3', fontWeight: 600 }}
                >
                  {t.title}
                </h3>
                <p className="text-stone mb-3" style={{ fontSize: '17px', lineHeight: '1.6' }}>
                  {t.summary}
                </p>
                <p
                  className="text-sage"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Open the tool →
                </p>
              </Link>
            ) : (
              <div
                key={t.slug}
                className="block py-8 border-b border-mist opacity-50"
              >
                <h3
                  className="text-ink mb-2"
                  style={{ fontSize: '24px', lineHeight: '1.3', fontWeight: 600 }}
                >
                  {t.title}
                </h3>
                <p className="text-stone mb-3" style={{ fontSize: '17px', lineHeight: '1.6' }}>
                  {t.summary}
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
