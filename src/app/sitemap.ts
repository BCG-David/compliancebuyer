import type { MetadataRoute } from 'next';

const LIVE_PILLARS = [
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

const SECTORS = ['restaurants', 'retail', 'hotels', 'schools', 'offices'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://compliancebuyer.com';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/sectors`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/for-professionals`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/compliance-check`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/ask-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...SECTORS.map((slug) => ({
      url: `${base}/sectors/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...LIVE_PILLARS.map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...LIVE_PILLARS.map((slug) => ({
      url: `${base}/${slug}/professional`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
