import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Link from 'next/link';

interface Obligation {
  topic: string;
  slug: string;
  why: string;
  priority: string;
}

interface SectorFrontmatter {
  title: string;
  sector: string;
  description: string;
  lastUpdated: string;
  intro: string;
  riskProfile: string;
  obligations: Obligation[];
  faqs?: { question: string; answer: string }[];
}

const SECTOR_SLUGS = ['restaurants', 'retail', 'hotels', 'schools', 'offices'];

export function generateStaticParams() {
  return SECTOR_SLUGS.map((sector) => ({ sector }));
}

function getSector(sector: string) {
  if (!SECTOR_SLUGS.includes(sector)) return null;
  const filePath = path.join(process.cwd(), 'src/content/sectors', `${sector}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const file = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(file);
  return { frontmatter: data as SectorFrontmatter, content };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  const { sector } = await params;
  const data = getSector(sector);
  if (!data) return {};
  return {
    title: data.frontmatter.title,
    description: data.frontmatter.description,
  };
}

export default async function SectorPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  const data = getSector(sector);
  if (!data) notFound();
  const { frontmatter, content } = data;

  const faqSchema = frontmatter.faqs
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: frontmatter.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Sector hero — dark, on brand */}
      <section className="on-ink" style={{ background: 'var(--cb-ink)' }}>
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-14">
          <Link href="/sectors" style={{ fontSize: '14px', color: 'var(--cb-signal)', textDecoration: 'none' }}>
            ← All sectors
          </Link>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '18px 0 10px', fontWeight: 600 }}>
            Compliance for {frontmatter.sector}
          </p>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 52px)', lineHeight: 1.08, letterSpacing: '-0.025em', fontWeight: 800, color: '#fff', margin: 0, maxWidth: '18ch' }}>
            {frontmatter.title}
          </h1>
          <p style={{ fontSize: '19px', lineHeight: 1.55, color: 'rgba(255,255,255,0.72)', maxWidth: '40em', marginTop: '20px' }}>
            {frontmatter.intro}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Risk profile callout */}
        <div className="cb-card-signal mb-14">
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: 'var(--cb-signal-dark)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Your risk profile
          </p>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'var(--cb-ink)', margin: 0 }}>
            {frontmatter.riskProfile}
          </p>
        </div>

        {/* What applies to you */}
        <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          What applies to you
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'var(--cb-slate)', marginBottom: '28px' }}>
          In the order it matters. Each links to a plain-English guide.
        </p>

        <div className="mb-16" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {frontmatter.obligations.map((o) => (
            <Link
              key={o.slug}
              href={`/${o.slug}`}
              className="cb-card hover:bg-cloud transition-colors"
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '19px', fontWeight: 700, color: 'var(--cb-ink)' }}>
                  {o.topic}
                </span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--cb-signal-dark)', whiteSpace: 'nowrap' }}>
                  {o.priority}
                </span>
              </div>
              <p style={{ fontSize: '16px', lineHeight: 1.55, color: 'var(--cb-slate)', margin: 0 }}>
                {o.why}
              </p>
            </Link>
          ))}
        </div>

        {/* Long-form MDX body */}
        <article className="prose-bcg mb-16">
          <MDXRemote source={content} />
        </article>

        {/* FAQs */}
        {frontmatter.faqs && frontmatter.faqs.length > 0 && (
          <section className="mb-16">
            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px' }}>
              Common questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {frontmatter.faqs.map((f, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--cb-line)', paddingBottom: '20px' }}>
                  <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '8px', color: 'var(--cb-ink)' }}>
                    {f.question}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: 1.6, color: 'var(--cb-slate)', margin: 0 }}>
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA to The Guide */}
        <div className="cb-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Not sure how this applies to your premises?
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: 'var(--cb-slate)', maxWidth: '32em', margin: '0 auto 20px' }}>
            Tell The Guide about your business and it will help you work out what you actually need —
            in plain English or full technical detail, your choice.
          </p>
          <Link href="/ask-guide" className="cb-btn-primary" style={{ background: 'var(--cb-signal)' }}>
            Review my risk →
          </Link>
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--cb-slate)', marginTop: '24px', textAlign: 'center' }}>
          Last updated {frontmatter.lastUpdated}. General information to help you understand your
          obligations and judge your own risk — not legal advice.
        </p>
      </div>
    </>
  );
}
