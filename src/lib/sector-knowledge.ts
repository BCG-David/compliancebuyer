import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

const SECTOR_SLUGS = ['restaurants', 'retail', 'hotels', 'schools', 'offices'];

interface Obligation {
  topic: string;
  priority: string;
  why: string;
}
interface SectorData {
  sector: string;
  riskProfile: string;
  obligations: Obligation[];
  faqs?: { question: string; answer: string }[];
}

/**
 * Reads the sector MDX files and builds a compact knowledge-base block for The Guide.
 * Generated from the same MDX that powers the /sectors pages, so the assistant and the
 * site stay in sync automatically — edit a sector page, the assistant's knowledge follows.
 */
export function buildSectorKnowledge(): string {
  const dir = path.join(process.cwd(), 'src/content/sectors');
  let out =
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'SECTOR GUIDES — WHAT APPLIES BY BUSINESS TYPE\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'When the person tells you what kind of business they run, use the matching sector profile below to frame your answer and prioritise what matters for them. These mirror the sector pages on the Compliance Buyer site. Always combine this with the detailed topic knowledge above — the sector profile tells you WHAT applies and in what order; the topic sections tell you the regulatory detail.\n';

  for (const slug of SECTOR_SLUGS) {
    const filePath = path.join(dir, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) continue;
    const data = matter(fs.readFileSync(filePath, 'utf-8')).data as SectorData;
    out += `\n--- ${data.sector.toUpperCase()} ---\n`;
    out += `Risk profile: ${data.riskProfile}\n`;
    out += 'Obligations in priority order:\n';
    for (const o of data.obligations) {
      out += `  • ${o.topic} [${o.priority}]: ${o.why}\n`;
    }
    if (data.faqs) {
      out += 'Common buyer questions:\n';
      for (const f of data.faqs) {
        out += `  Q: ${f.question}\n  A: ${f.answer}\n`;
      }
    }
  }
  return out;
}
