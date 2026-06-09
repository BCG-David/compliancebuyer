import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { EditorialCredit, PlainEnglishDisclaimer } from '@/components/editorial-credit';

interface PillarFrontmatter {
  title: string;
  description: string;
  lastUpdated: string;
  audience: string;
  faqs?: { question: string; answer: string }[];
}

const PILLAR_SLUGS = [
  'health-safety-risk-assessment',
  'fire-risk-assessment',
  'pat-testing',
  'legionella',
  'fire-alarms',
  'emergency-lighting',
  'electrical-testing',
  'gas-safety',
  'asbestos',
  'fire-extinguishers',
  'workplace-safety-training',
];

export function generateStaticParams() {
  return PILLAR_SLUGS.map((slug) => ({ slug }));
}

function getPillar(slug: string) {
  if (!PILLAR_SLUGS.includes(slug)) return null;
  const filePath = path.join(process.cwd(), 'src/content/pillars', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const file = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(file);
  return { frontmatter: data as PillarFrontmatter, content };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) return {};
  return {
    title: pillar.frontmatter.title,
    description: pillar.frontmatter.description,
  };
}

export default async function PillarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pillar.frontmatter.title,
    description: pillar.frontmatter.description,
    dateModified: pillar.frontmatter.lastUpdated,
    author: { '@type': 'Organization', name: 'Compliance Buyer' },
    publisher: {
      '@type': 'Organization',
      name: 'Compliance Buyer',
      url: 'https://compliancebuyer.com',
    },
  };

  const faqSchema = pillar.frontmatter.faqs
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: pillar.frontmatter.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;

  return (
    <article className="max-w-prose mx-auto px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <EditorialCredit lastUpdated={pillar.frontmatter.lastUpdated} />

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
          {pillar.frontmatter.title}
        </h1>
        <p className="lead text-stone" style={{ fontSize: '21px', lineHeight: '1.6' }}>
          {pillar.frontmatter.description}
        </p>
      </header>

      <div className="prose-bcg">
        <MDXRemote source={pillar.content} />
      </div>

      <PlainEnglishDisclaimer />
    </article>
  );
}
