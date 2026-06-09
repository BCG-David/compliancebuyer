'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  assessCompliance,
  type BusinessProfile,
  type BusinessType,
  type EmployeeCount,
  type PremisesAge,
  type Ownership,
  type TopicResult,
} from '@/lib/compliance-check';

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: 'office', label: 'Office or professional services' },
  { value: 'retail', label: 'Shop or retail' },
  { value: 'restaurant', label: 'Restaurant, café or pub' },
  { value: 'hotel', label: 'Hotel or B&B' },
  { value: 'warehouse', label: 'Warehouse or logistics' },
  { value: 'manufacturing', label: 'Manufacturing or industrial' },
  { value: 'care-home', label: 'Care home or healthcare' },
  { value: 'school', label: 'School, nursery or education' },
  { value: 'hmo-landlord', label: 'HMO landlord' },
  { value: 'residential-landlord', label: 'Residential landlord (single-let)' },
  { value: 'construction', label: 'Construction or trades' },
  { value: 'other', label: 'Other / mixed use' },
];

const EMPLOYEE_COUNTS: { value: EmployeeCount; label: string }[] = [
  { value: '1-4', label: '1–4 employees' },
  { value: '5-19', label: '5–19 employees' },
  { value: '20-49', label: '20–49 employees' },
  { value: '50-249', label: '50–249 employees' },
  { value: '250+', label: '250+ employees' },
];

const PREMISES_AGES: { value: PremisesAge; label: string }[] = [
  { value: 'pre-2000', label: 'Built before 2000' },
  { value: 'post-2000', label: 'Built 2000 or later' },
  { value: 'unknown', label: "I don't know" },
];

const OWNERSHIP_OPTIONS: { value: Ownership; label: string }[] = [
  { value: 'own', label: 'I own the building' },
  { value: 'lease', label: 'I lease the building' },
  { value: 'manage', label: 'I manage it for someone else' },
];

const PRIORITY_LABELS = {
  critical: 'Critical — legally required',
  required: 'Required',
  recommended: 'Recommended',
  situational: 'Situational',
};

const PRIORITY_BORDER = {
  critical: 'var(--bcg-sage)',
  required: 'var(--bcg-sage)',
  recommended: 'var(--bcg-stone)',
  situational: 'var(--bcg-mist)',
};

const interStyle = { fontFamily: 'Inter, sans-serif' };

export default function ComplianceCheckPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<BusinessProfile>>({});
  const [results, setResults] = useState<TopicResult[] | null>(null);

  const totalSteps = 6;

  function update<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function next() {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      const fullProfile = profile as BusinessProfile;
      setResults(assessCompliance(fullProfile));
    }
  }

  function back() {
    if (results) {
      setResults(null);
      setStep(totalSteps - 1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  }

  function restart() {
    setProfile({});
    setStep(0);
    setResults(null);
  }

  if (results) {
    const counts = {
      critical: results.filter((r) => r.priority === 'critical').length,
    };

    return (
      <div className="max-w-prose mx-auto px-6 py-20">
        <p
          className="mb-8"
          style={{
            ...interStyle,
            fontSize: '13px',
            color: 'var(--bcg-sage)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Your Compliance Profile
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
          You have {results.length} compliance areas to manage
        </h1>

        <p className="text-stone mb-12" style={{ fontSize: '21px', lineHeight: '1.6' }}>
          Based on what you've told us, here's what applies to your business &mdash; in priority
          order.
          {counts.critical > 0 && ` ${counts.critical} are legally critical.`}
        </p>

        <div className="space-y-4 mb-12">
          {results.map((r) => (
            <Link
              key={r.slug}
              href={`/${r.slug}`}
              className="block p-6 hover:bg-note transition-colors"
              style={{
                background: 'var(--bcg-paper)',
                border: '1px solid var(--bcg-mist)',
                borderTop: `3px solid ${PRIORITY_BORDER[r.priority]}`,
                borderRadius: '4px',
                textDecoration: 'none',
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2
                  className="text-ink"
                  style={{ fontSize: '22px', lineHeight: '1.3', fontWeight: 600 }}
                >
                  {r.title}
                </h2>
                <span
                  style={{
                    ...interStyle,
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: 'var(--bcg-stone)',
                    whiteSpace: 'nowrap',
                    marginTop: '4px',
                  }}
                >
                  {PRIORITY_LABELS[r.priority]}
                </span>
              </div>
              <p className="text-ink mb-3" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                {r.reason}
              </p>
              <div className="flex items-center justify-between" style={interStyle}>
                <span style={{ fontSize: '14px', color: 'var(--bcg-stone)' }}>
                  Typical cost: <strong style={{ color: 'var(--bcg-ink)' }}>{r.estimatedCost}</strong>
                </span>
                <span
                  style={{ fontSize: '14px', color: 'var(--bcg-sage)', fontWeight: 600 }}
                >
                  Read the guide →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="border-t pt-8 mb-12" style={{ borderColor: 'var(--bcg-mist)' }}>
          <h2
            className="text-ink mb-3"
            style={{ fontSize: '24px', fontWeight: 600 }}
          >
            What next?
          </h2>
          <p className="text-ink mb-4" style={{ fontSize: '17px', lineHeight: '1.7' }}>
            Read the guides above for what each compliance area actually requires. Each guide has
            plain-English answers and a technical version for professionals.
          </p>
          <p className="text-ink" style={{ fontSize: '17px', lineHeight: '1.7' }}>
            Not sure how this applies to your premises?{' '}
            <Link
              href="/ask-guide"
              className="text-sage underline underline-offset-4"
            >
              Ask The Guide
            </Link>
            .
          </p>
        </div>

        <div className="flex gap-4" style={interStyle}>
          <button
            onClick={restart}
            className="px-5 py-3 text-sm font-semibold border hover:bg-note"
            style={{
              borderColor: 'var(--bcg-stone)',
              color: 'var(--bcg-ink)',
              borderRadius: '4px',
            }}
          >
            Start again
          </button>
          <button
            onClick={back}
            className="px-5 py-3 text-sm font-semibold border hover:bg-note"
            style={{
              borderColor: 'var(--bcg-stone)',
              color: 'var(--bcg-ink)',
              borderRadius: '4px',
            }}
          >
            Change my answers
          </button>
        </div>

        <p
          className="mt-12 leading-relaxed"
          style={{ ...interStyle, fontSize: '13px', color: 'var(--bcg-stone)' }}
        >
          This tool gives general guidance based on your inputs. It is not a substitute for a
          qualified compliance assessment. Cost estimates are typical UK ranges and vary widely
          based on premises and provider.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <p
        className="mb-8"
        style={{
          ...interStyle,
          fontSize: '13px',
          color: 'var(--bcg-sage)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        Compliance Check
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
        Find out what compliance your business needs.
      </h1>

      <p className="text-stone mb-12" style={{ fontSize: '21px', lineHeight: '1.6' }}>
        Answer 6 short questions. We'll show you which UK compliance areas apply to your
        business, in priority order, with rough cost estimates.
      </p>

      <div className="mb-12" style={interStyle}>
        <div className="flex justify-between mb-2">
          <span style={{ fontSize: '13px', color: 'var(--bcg-stone)' }}>
            Step {step + 1} of {totalSteps}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--bcg-stone)' }}>
            {Math.round(((step + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-1 rounded" style={{ background: 'var(--bcg-mist)' }}>
          <div
            className="h-1 rounded transition-all"
            style={{
              width: `${((step + 1) / totalSteps) * 100}%`,
              background: 'var(--bcg-sage)',
            }}
          />
        </div>
      </div>

      {step === 0 && (
        <Question
          title="What kind of business or property is this?"
          options={BUSINESS_TYPES}
          value={profile.type}
          onChange={(v) => update('type', v)}
        />
      )}
      {step === 1 && (
        <Question
          title="How many people work at the premises?"
          subtitle="Include staff, contractors regularly on site, and self-employed working there."
          options={EMPLOYEE_COUNTS}
          value={profile.employeeCount}
          onChange={(v) => update('employeeCount', v)}
        />
      )}
      {step === 2 && (
        <Question
          title="When was the building built?"
          subtitle="This determines whether asbestos rules apply."
          options={PREMISES_AGES}
          value={profile.premisesAge}
          onChange={(v) => update('premisesAge', v)}
        />
      )}
      {step === 3 && (
        <Question
          title="What's your relationship to the building?"
          options={OWNERSHIP_OPTIONS}
          value={profile.ownership}
          onChange={(v) => update('ownership', v)}
        />
      )}
      {step === 4 && (
        <BooleanQuestion
          title="Does the premises have any gas appliances?"
          subtitle="Boilers, hobs, ovens, water heaters, commercial catering."
          value={profile.hasGas}
          onChange={(v) => update('hasGas', v)}
        />
      )}
      {step === 5 && (
        <BooleanQuestion
          title="Does the premises have a water system?"
          subtitle="Hot and cold water taps, showers, water tanks. Almost all premises do."
          value={profile.hasWaterSystem}
          onChange={(v) => update('hasWaterSystem', v)}
        />
      )}

      <div className="mt-12 flex gap-3" style={interStyle}>
        {step > 0 && (
          <button
            onClick={back}
            className="px-6 py-3 text-sm font-semibold border hover:bg-note"
            style={{
              borderColor: 'var(--bcg-stone)',
              color: 'var(--bcg-ink)',
              borderRadius: '4px',
            }}
          >
            Back
          </button>
        )}
        <button
          onClick={next}
          disabled={!isStepComplete(step, profile)}
          className="px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed"
          style={{
            background: isStepComplete(step, profile) ? 'var(--bcg-sage)' : 'var(--bcg-mist)',
            color: isStepComplete(step, profile) ? 'var(--bcg-paper)' : 'var(--bcg-stone)',
            borderRadius: '4px',
          }}
        >
          {step === totalSteps - 1 ? 'See my results' : 'Next'}
        </button>
      </div>
    </div>
  );
}

function Question<T extends string>({
  title,
  subtitle,
  options,
  value,
  onChange,
}: {
  title: string;
  subtitle?: string;
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <h2
        className="text-ink mb-3"
        style={{ fontSize: '28px', lineHeight: '1.3', fontWeight: 600 }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-stone mb-6" style={{ fontSize: '16px', lineHeight: '1.55' }}>
          {subtitle}
        </p>
      )}
      <div className="space-y-2" style={interStyle}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="w-full p-4 text-left text-base transition-colors"
            style={{
              border:
                value === opt.value
                  ? '2px solid var(--bcg-sage)'
                  : '1px solid var(--bcg-mist)',
              background:
                value === opt.value ? 'var(--bcg-note)' : 'var(--bcg-paper)',
              color: 'var(--bcg-ink)',
              borderRadius: '4px',
              padding: value === opt.value ? '15px' : '16px',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function BooleanQuestion({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle?: string;
  value: boolean | undefined;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <h2
        className="text-ink mb-3"
        style={{ fontSize: '28px', lineHeight: '1.3', fontWeight: 600 }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-stone mb-6" style={{ fontSize: '16px', lineHeight: '1.55' }}>
          {subtitle}
        </p>
      )}
      <div className="space-y-2" style={interStyle}>
        {[
          { val: true, label: 'Yes' },
          { val: false, label: 'No' },
        ].map((opt) => (
          <button
            key={String(opt.val)}
            onClick={() => onChange(opt.val)}
            className="w-full p-4 text-left text-base transition-colors"
            style={{
              border:
                value === opt.val
                  ? '2px solid var(--bcg-sage)'
                  : '1px solid var(--bcg-mist)',
              background:
                value === opt.val ? 'var(--bcg-note)' : 'var(--bcg-paper)',
              color: 'var(--bcg-ink)',
              borderRadius: '4px',
              padding: value === opt.val ? '15px' : '16px',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function isStepComplete(step: number, profile: Partial<BusinessProfile>): boolean {
  switch (step) {
    case 0:
      return profile.type !== undefined;
    case 1:
      return profile.employeeCount !== undefined;
    case 2:
      return profile.premisesAge !== undefined;
    case 3:
      return profile.ownership !== undefined;
    case 4:
      return profile.hasGas !== undefined;
    case 5:
      return profile.hasWaterSystem !== undefined;
    default:
      return false;
  }
}
