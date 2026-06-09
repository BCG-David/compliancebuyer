import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expert Interviews',
  description:
    'Conversations with UK compliance professionals — fire risk assessors, regulators, accountable persons, and industry leaders.',
  robots: { index: false, follow: true },
};

export default function ExpertInterviewsPage() {
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
        Coming Soon
      </p>

      <h1
        className="text-ink mb-6"
        style={{
          fontSize: '52px',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          fontWeight: 700,
        }}
      >
        Expert Interviews
      </h1>

      <p className="text-stone mb-8" style={{ fontSize: '21px', lineHeight: '1.6' }}>
        Long-form conversations with the people doing UK compliance work &mdash; fire risk
        assessors, regulators, accountable persons of higher-risk buildings, and industry
        leaders. Real practitioner perspectives, not press releases.
      </p>

      <p className="text-ink" style={{ fontSize: '18px', lineHeight: '1.7' }}>
        First interviews coming soon. If you'd like to be interviewed or have a topic you'd like
        covered, contact{' '}
        <a
          href="mailto:hello@compliancebuyer.com"
          className="text-sage underline underline-offset-4"
        >
          hello@compliancebuyer.com
        </a>
        .
      </p>
    </div>
  );
}
