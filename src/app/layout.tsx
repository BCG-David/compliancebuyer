import type { Metadata } from 'next';
import { Source_Serif_4, Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://compliancebuyer.com'),
  title: {
    default: 'Compliance Buyer — Compliance is complicated. Buying it shouldn’t be.',
    template: '%s | Compliance Buyer',
  },
  description:
    'Plain answers on what UK compliance law actually requires — so the people who carry the risk can understand their obligations, judge their own risk, and decide what they actually need. Fire, electrical, gas, water hygiene, asbestos.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://compliancebuyer.com',
    siteName: 'Compliance Buyer',
    title: 'Compliance Buyer — Compliance is complicated. Buying it shouldn’t be.',
    description:
      'Understand your obligations, judge your own risk, decide what you actually need. Built for the people who carry the risk.',
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Compliance Buyer',
  url: 'https://compliancebuyer.com',
  description:
    'Plain-English UK workplace compliance reference for the people who carry the risk: fire safety, electrical, gas, water hygiene, asbestos.',
};

const navLinks = [
  { href: '/sectors', label: 'Sectors' },
  { href: '/', label: 'Guides' },
  { href: '/tools', label: 'Tools' },
  { href: '/ask-guide', label: 'Ask the Guide' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${sourceSerif.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <header className="on-ink" style={{ background: 'var(--cb-ink)' }}>
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link
              href="/"
              className="wordmark no-underline"
              style={{ fontSize: '24px', letterSpacing: '-0.01em' }}
            >
              Compliance<span className="wm-buyer">Buyer</span>
            </Link>
            <nav
              className="flex gap-7 items-center"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
            >
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{ color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}
                  className="hover:text-signal"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/ask-guide"
                className="cb-btn-primary"
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Review my risk →
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer
          style={{ background: 'var(--cb-ink)', marginTop: '6rem', fontFamily: 'Inter, sans-serif' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div
              className="wordmark on-ink mb-6"
              style={{ fontSize: '20px' }}
            >
              <span style={{ color: '#fff' }}>Compliance</span><span className="wm-buyer">Buyer</span>
            </div>
            <div className="flex flex-wrap gap-8 mb-8" style={{ fontSize: '14px' }}>
              <Link href="/sectors" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover:text-signal">Sectors</Link>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover:text-signal">Guides</Link>
              <Link href="/for-professionals" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover:text-signal">For Professionals</Link>
              <Link href="/tools" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover:text-signal">Tools</Link>
              <Link href="/ask-guide" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover:text-signal">Ask the Guide</Link>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>
              © {new Date().getFullYear()} Compliance Buyer. Plain-English UK workplace compliance
              reference, built for the people who carry the risk.
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: '46rem' }}>
              Compliance Buyer provides general information about UK compliance requirements to help
              you understand your obligations and judge your own risk. It is not legal or
              professional advice. You remain responsible for deciding what your situation requires;
              for advice on your specific circumstances, consult a suitably qualified professional.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
