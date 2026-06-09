'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GuideHero() {
  const [question, setQuestion] = useState('');
  const router = useRouter();

  const goToGuide = (q?: string) => {
    const value = (q ?? question).trim();
    if (value) sessionStorage.setItem('guide_initial_question', value);
    router.push('/ask-guide');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToGuide();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      goToGuide();
    }
  };

  const exampleQuestions = [
    'I run a restaurant — what do I actually need?',
    'How often should EICRs be done?',
    'Is the asbestos in my building a problem?',
    'What does PAT testing really cover?',
  ];

  return (
    <section className="on-ink" style={{ background: 'var(--cb-ink)' }}>
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-24">
        {/* Eyebrow — risk-tolerance framing, not personal-buyer framing */}
        <div
          className="inline-flex items-center gap-2 mb-8"
          style={{
            background: 'rgba(245,166,35,0.12)',
            border: '1px solid rgba(245,166,35,0.4)',
            borderRadius: '100px',
            padding: '6px 16px',
          }}
        >
          <span style={{ fontSize: '13px', color: 'var(--cb-signal)', fontWeight: 500 }}>
            Built for the people who carry the risk
          </span>
        </div>

        {/* Hero headline — the locked strapline */}
        <h1
          style={{
            fontSize: 'clamp(40px, 6vw, 68px)',
            lineHeight: 1.04,
            letterSpacing: '-0.025em',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: 0,
            maxWidth: '15ch',
          }}
        >
          Compliance is complicated.{' '}
          <span style={{ color: 'var(--cb-signal)' }}>Buying it shouldn’t be.</span>
        </h1>

        <p
          style={{
            fontSize: '20px',
            lineHeight: 1.55,
            color: 'rgba(255,255,255,0.72)',
            maxWidth: '34em',
            margin: '24px 0 0',
          }}
        >
          Compliance Buyer helps you cut through the noise, understand your options, and make sure
          you’re reducing your risk.
        </p>

        {/* The Guide entry — diagnostic, not a search box */}
        <form onSubmit={handleSubmit} style={{ maxWidth: '640px', marginTop: '36px' }}>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', margin: '0 0 10px' }}>
            What does your business actually need?
          </p>
          <div
            className="flex gap-2 items-center"
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '8px',
            }}
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me about your business…"
              style={{
                flex: 1,
                padding: '12px 14px',
                fontSize: '16px',
                color: 'var(--cb-ink)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
            />
            <button type="submit" className="cb-btn-primary" style={{ flexShrink: 0 }}>
              Review my risk →
            </button>
          </div>
        </form>

        {/* Example prompts */}
        <div style={{ maxWidth: '640px', marginTop: '18px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>
            Or start with:
          </p>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => goToGuide(q)}
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.82)',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '100px',
                  padding: '7px 14px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Trust signals — recast from "independent editorial" to plain-answer / risk framing */}
        <div
          className="flex flex-wrap items-center gap-6"
          style={{ marginTop: '40px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}
        >
          <span>11 compliance topics, plain English or technical</span>
          <span>·</span>
          <span>What the law requires — and what it should cost</span>
          <span>·</span>
          <span>No jargon, no upsell</span>
        </div>
      </div>
    </section>
  );
}
