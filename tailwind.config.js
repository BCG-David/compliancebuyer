/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // ─────────────────────────────────────────────
        // Compliance Buyer — brand palette
        // Direction A: Ink & Signal Amber. Dark-first.
        // ─────────────────────────────────────────────
        ink: '#0F1A2E',       // Primary brand colour — deep navy/near-black
        'ink-800': '#16243D', // Slightly lifted ink — raised surfaces on dark
        'ink-700': '#1F3050', // Card surfaces on dark, hover states
        signal: '#F5A623',    // Signal Amber — the accent ("Buyer", CTAs, highlights)
        'signal-dark': '#C77F12', // Amber for text on light backgrounds (AA contrast)
        paper: '#FFFFFF',     // Clean white — primary light background
        cloud: '#F6F7F9',     // Subtle cool grey — light section backgrounds, cards
        line: '#E3E6EB',      // Hairline borders on light
        'line-dark': 'rgba(255,255,255,0.10)', // Hairline borders on dark
        slate: '#5A6473',     // Secondary text on light
        'slate-light': 'rgba(255,255,255,0.70)', // Secondary text on dark

        // ── Legacy aliases (so existing pillar/tool classes don't break) ──
        sage: '#F5A623',      // was #3D5A4A — now accent
        accent: '#F5A623',
        stone: '#5A6473',
        mist: '#E3E6EB',
        note: '#F6F7F9',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        caption: ['14px', { lineHeight: '1.5' }],
        meta: ['15px', { lineHeight: '1.5' }],
        nav: ['16px', { lineHeight: '1.5' }],
        body: ['18px', { lineHeight: '1.7' }],
        lead: ['21px', { lineHeight: '1.6' }],
        h3: ['26px', { lineHeight: '1.3' }],
        h2: ['36px', { lineHeight: '1.2' }],
        h1: ['60px', { lineHeight: '1.05' }],
        hero: ['72px', { lineHeight: '1.0' }],
      },
      letterSpacing: {
        wordmark: '-0.01em',
        tight: '-0.02em',
      },
      maxWidth: {
        prose: '720px',
      },
    },
  },
  plugins: [],
};
