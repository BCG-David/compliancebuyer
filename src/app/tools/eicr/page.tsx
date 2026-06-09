"use client";

import { useState } from "react";
import Link from "next/link";

type PremisesType =
  | "office"
  | "retail"
  | "hospitality"
  | "industrial"
  | "warehouse"
  | "education"
  | "healthcare"
  | "residential-block"
  | "hmo"
  | "other";
type Age = "new" | "modern" | "older" | "vintage";
type UseIntensity = "low" | "medium" | "high";

interface Result {
  recommendedFrequency: string;
  frequencyReasoning: string;
  estimatedCircuits: number;
  costLow: number;
  costHigh: number;
  notes: string[];
  questionsToAsk: string[];
}

const MIN_CHARGE = 399;
const PER_CIRCUIT = 9.99;

function calculate(
  premises: PremisesType,
  floorArea: number,
  distributionBoards: number,
  knownCircuits: number | null,
  age: Age,
  intensity: UseIntensity
): Result {
  const notes: string[] = [];

  let recommendedFrequency = "Every 5 years";
  let frequencyReasoning =
    "Standard commercial premises with no specific risk factors operate on a 5-year EICR cycle as the maximum interval under BS 7671 Guidance Note 3.";

  if (premises === "industrial" || premises === "warehouse") {
    recommendedFrequency = "Every 3 years";
    frequencyReasoning =
      "Industrial and warehouse premises see harsher conditions (dust, vibration, mechanical damage, frequent equipment changes). Guidance Note 3 supports a 3-year maximum interval for these environments.";
  } else if (premises === "education") {
    recommendedFrequency = "Every 5 years (3 years for higher-risk areas)";
    frequencyReasoning =
      "Education premises run on a 5-year cycle for general areas, with shorter intervals for laboratories, workshops, and design technology spaces.";
  } else if (premises === "healthcare") {
    recommendedFrequency = "Every 3 years (annually for clinical areas)";
    frequencyReasoning =
      "Healthcare premises follow HTM 06-01 in addition to BS 7671. Clinical areas have specific requirements for medical IT systems, isolated supplies, and continuity — annual inspection of clinical circuits is typical.";
  } else if (premises === "hospitality") {
    recommendedFrequency = "Every 5 years";
    frequencyReasoning =
      "Hospitality premises generally operate on a 5-year cycle, though kitchens, cellars, and pool plant rooms may warrant separate, more frequent attention.";
  } else if (premises === "hmo") {
    recommendedFrequency = "Every 5 years (statutory for licensed HMOs)";
    frequencyReasoning =
      "Licensed HMOs are required by law (Electrical Safety Standards in the Private Rented Sector Regulations 2020) to have a satisfactory EICR completed every 5 years.";
  } else if (premises === "residential-block") {
    recommendedFrequency = "Every 5 years (common parts)";
    frequencyReasoning =
      "Residential block common parts operate on a 5-year cycle. Individual flats are the leaseholder's responsibility unless tenanted.";
  } else if (age === "vintage") {
    recommendedFrequency = "Every 3 years";
    frequencyReasoning =
      "Older installations (pre-current edition wiring regulations) are at higher risk of progressive deterioration and may not meet current standards. Shorter inspection cycles compensate.";
  } else if (intensity === "high") {
    recommendedFrequency = "Every 3-5 years";
    frequencyReasoning =
      "High-intensity use accelerates wear on connections, RCDs, and switchgear — shorter cycles within the BS 7671 maximum are typically used.";
  }

  let estimatedCircuits: number;
  if (knownCircuits !== null && knownCircuits > 0) {
    estimatedCircuits = knownCircuits;
  } else {
    const fromArea = Math.ceil(floorArea / 30);
    const fromDBs = distributionBoards * 10;
    estimatedCircuits = Math.max(fromArea, fromDBs);

    if (premises === "industrial") {
      estimatedCircuits = Math.ceil(estimatedCircuits * 1.3);
    } else if (premises === "warehouse") {
      estimatedCircuits = Math.max(
        Math.ceil(floorArea / 80),
        distributionBoards * 8
      );
    } else if (premises === "healthcare") {
      estimatedCircuits = Math.ceil(estimatedCircuits * 1.4);
    }
  }

  const baselineCost = Math.max(MIN_CHARGE, estimatedCircuits * PER_CIRCUIT);
  let costLow = Math.round(baselineCost);
  let costHigh = Math.round(baselineCost * 1.5);

  if (premises === "healthcare" || premises === "industrial") {
    costHigh = Math.round(costHigh * 1.2);
    notes.push(
      `${premises === "healthcare" ? "Healthcare" : "Industrial"} environments typically command a premium for EICR work — specialist competence, longer time on site, and more careful documentation all push prices up.`
    );
  }

  if (age === "vintage") {
    notes.push(
      "Older installations often produce more remedial work than the EICR itself bills — the inspection identifies items that need replacement. Budget for remedial work in addition to the inspection."
    );
  }

  if (distributionBoards > 3) {
    notes.push(
      `${distributionBoards} distribution boards is a meaningful inspection task — expect at least a full day on site for the inspection, plus testing time.`
    );
  }

  if (premises === "hmo") {
    notes.push(
      "Licensed HMOs have a statutory EICR requirement under the 2020 Regulations. The local authority can request the certificate at any time and impose remedial deadlines if the report identifies issues."
    );
  } else if (premises === "healthcare") {
    notes.push(
      "Healthcare premises operate under HTM 06-01 in addition to BS 7671. The EICR for clinical areas must be coordinated with the trust's authorising engineer."
    );
  }

  notes.push(
    "BS 7671 18th Edition (and current amendments) is the standard against which the inspection is conducted. The EICR records non-compliances and codes them by severity (C1, C2, C3, FI). Code C3 items are 'professional recommendations from a competent person' — not optional housekeeping. Treat them seriously."
  );

  const questionsToAsk = [
    "What proportion of circuits will be tested? An EICR is sample-based; the proportion (typically 20% as a minimum, 100% for higher-risk premises) should be documented and justified.",
    "Are you certified by a competent-person scheme? NICEIC, NAPIT, ELECSA, or Stroma membership is the standard expectation.",
    "Will you provide a draft report before issuing the final certificate? Reputable inspectors flag major items during the inspection, not as a surprise in the final document.",
    "What's included in the price? Some quotes exclude isolation, restoration, certificate issue fees, or follow-up tests on remediated items.",
    "What are your fees for remedial work, and are you the contractor doing the remediation? An inspector who's also the contractor on the remediation work has a structural conflict of interest.",
  ];

  return {
    recommendedFrequency,
    frequencyReasoning,
    estimatedCircuits,
    costLow,
    costHigh,
    notes,
    questionsToAsk,
  };
}

export default function EICRCalculator() {
  const [premises, setPremises] = useState<PremisesType>("office");
  const [floorArea, setFloorArea] = useState<string>("500");
  const [distributionBoards, setDistributionBoards] = useState<string>("2");
  const [useKnownCircuits, setUseKnownCircuits] = useState(false);
  const [knownCircuits, setKnownCircuits] = useState<string>("");
  const [age, setAge] = useState<Age>("modern");
  const [intensity, setIntensity] = useState<UseIntensity>("medium");
  const [result, setResult] = useState<Result | null>(null);

  function handleCalculate() {
    const area = parseFloat(floorArea);
    const dbs = parseInt(distributionBoards, 10);
    if (isNaN(area) || isNaN(dbs) || area < 1 || dbs < 1) {
      setResult(null);
      return;
    }
    const known = useKnownCircuits ? parseInt(knownCircuits, 10) : null;
    setResult(
      calculate(
        premises,
        area,
        dbs,
        useKnownCircuits && known && known > 0 ? known : null,
        age,
        intensity
      )
    );
  }

  return (
    <main className="min-h-screen bg-bcg-paper text-bcg-ink">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/tools"
          className="text-sm text-bcg-sage hover:underline mb-8 inline-block"
        >
          ← Tools
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">
          EICR Cost Estimator
        </h1>
        <p className="text-bcg-stone text-lg mb-2 leading-relaxed">
          An indicative cost range and frequency recommendation for the
          Electrical Installation Condition Report on your premises. Output
          should be used to sense-check quotes received, not as a quoting tool
          itself.
        </p>
        <p className="text-bcg-stone text-sm mb-12 italic">
          Methodology drawn from BS 7671 18th Edition (and current amendments)
          and IET Guidance Note 3.
        </p>

        <div className="bg-bcg-mist/50 border border-bcg-mist p-8 rounded-sm mb-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="premises"
                className="block font-serif text-lg mb-2"
              >
                Premises type
              </label>
              <select
                id="premises"
                value={premises}
                onChange={(e) => setPremises(e.target.value as PremisesType)}
                className="w-full md:w-80 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              >
                <option value="office">Office</option>
                <option value="retail">Retail</option>
                <option value="hospitality">Hospitality / restaurant</option>
                <option value="industrial">Industrial / manufacturing</option>
                <option value="warehouse">Warehouse / storage</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="residential-block">
                  Residential block (common parts)
                </option>
                <option value="hmo">HMO (licensed)</option>
                <option value="other">Other commercial</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="floorArea"
                  className="block font-serif text-lg mb-2"
                >
                  Floor area (m²)
                </label>
                <input
                  id="floorArea"
                  type="number"
                  min="1"
                  value={floorArea}
                  onChange={(e) => setFloorArea(e.target.value)}
                  className="w-full px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
                />
              </div>

              <div>
                <label
                  htmlFor="distributionBoards"
                  className="block font-serif text-lg mb-2"
                >
                  Distribution boards
                </label>
                <input
                  id="distributionBoards"
                  type="number"
                  min="1"
                  value={distributionBoards}
                  onChange={(e) => setDistributionBoards(e.target.value)}
                  className="w-full px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={useKnownCircuits}
                  onChange={(e) => setUseKnownCircuits(e.target.checked)}
                  className="mr-3 w-4 h-4 accent-bcg-sage"
                />
                <span className="font-serif text-lg">
                  I know the number of circuits
                </span>
              </label>
              {useKnownCircuits && (
                <div>
                  <p className="text-sm text-bcg-stone mb-2">
                    Sum of circuits across all distribution boards.
                  </p>
                  <input
                    type="number"
                    min="1"
                    value={knownCircuits}
                    onChange={(e) => setKnownCircuits(e.target.value)}
                    placeholder="e.g. 24"
                    className="w-32 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
                  />
                </div>
              )}
              {!useKnownCircuits && (
                <p className="text-sm text-bcg-stone">
                  Circuits will be estimated from floor area, distribution
                  board count, and premises type.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="block font-serif text-lg mb-2">
                Installation age
              </label>
              <p className="text-sm text-bcg-stone mb-2">
                The installation age, not the building age — refurbishments
                often re-age the wiring even in old buildings.
              </p>
              <select
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value as Age)}
                className="w-full md:w-80 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              >
                <option value="new">New (within 5 years)</option>
                <option value="modern">
                  Modern (5-20 years, BS 7671 17th/18th Edition)
                </option>
                <option value="older">
                  Older (20-40 years, earlier editions)
                </option>
                <option value="vintage">
                  Vintage (40+ years, may have rubber/lead cabling)
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="intensity"
                className="block font-serif text-lg mb-2"
              >
                Use intensity
              </label>
              <select
                id="intensity"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as UseIntensity)}
                className="w-full md:w-80 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              >
                <option value="low">Low (light office, occasional use)</option>
                <option value="medium">Medium (standard commercial)</option>
                <option value="high">
                  High (24-hour, heavy machinery, public access)
                </option>
              </select>
            </div>

            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-bcg-ink text-bcg-paper font-serif text-lg rounded-sm hover:bg-bcg-sage transition-colors"
            >
              Calculate
            </button>
          </div>
        </div>

        {result && (
          <div className="border-t-2 border-bcg-ink pt-8 mb-12">
            <h2 className="font-serif text-2xl mb-6">Indicative result</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-bcg-note p-6 rounded-sm">
                <p className="text-sm text-bcg-stone uppercase tracking-wide mb-1">
                  Recommended frequency
                </p>
                <p className="font-serif text-2xl text-bcg-ink">
                  {result.recommendedFrequency}
                </p>
              </div>

              <div className="bg-bcg-note p-6 rounded-sm">
                <p className="text-sm text-bcg-stone uppercase tracking-wide mb-1">
                  Indicative cost range
                </p>
                <p className="font-serif text-2xl text-bcg-ink">
                  £{result.costLow.toLocaleString()} – £
                  {result.costHigh.toLocaleString()}
                </p>
                <p className="text-sm text-bcg-stone mt-2">
                  ~{result.estimatedCircuits} circuits estimated
                </p>
              </div>
            </div>

            <div className="bg-bcg-note border-l-4 border-bcg-sage p-5 mb-6">
              <p className="font-serif text-lg mb-1">Frequency reasoning</p>
              <p className="text-bcg-ink">{result.frequencyReasoning}</p>
            </div>

            {result.notes.length > 0 && (
              <>
                <h3 className="font-serif text-xl mb-3">
                  Notes on your premises
                </h3>
                <ul className="space-y-2 mb-6 text-bcg-ink">
                  {result.notes.map((n, i) => (
                    <li key={i} className="flex">
                      <span className="text-bcg-sage mr-3">·</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h3 className="font-serif text-xl mb-3">
              Questions to ask any quoting electrician
            </h3>
            <ol className="space-y-3 mb-6 text-bcg-ink list-decimal list-outside ml-5">
              {result.questionsToAsk.map((q, i) => (
                <li key={i} className="pl-1">
                  {q}
                </li>
              ))}
            </ol>

            <div className="bg-bcg-mist/60 p-6 rounded-sm text-sm text-bcg-stone mb-6">
              <p className="font-serif text-base text-bcg-ink mb-2">
                Important caveat
              </p>
              <p>
                This is an indicative estimate based on the inputs you&apos;ve
                provided. Specific premises may produce quotes outside this
                range for legitimate reasons — out-of-hours requirements,
                difficult access, three-phase complexity, accommodation of
                specific industries, or significant remedial work flagged
                during the inspection. The estimate covers the inspection and
                certificate only; remedial work to address C1 and C2 codes is
                separate. Always verify with a competent person (NICEIC,
                NAPIT, ELECSA, or Stroma certified) before commissioning
                work.
              </p>
            </div>

            <div className="bg-bcg-mist/60 p-6 rounded-sm text-sm text-bcg-stone">
              <p className="font-serif text-base text-bcg-ink mb-2">
                Pricing methodology
              </p>
              <p>
                Cost ranges shown are derived from contemporary UK market
                rates for the service category, sampled across multiple
                providers and jurisdictions to reflect typical pricing
                variation. The lower bound reflects volume-discounted rates
                from established providers; the upper bound accommodates
                premium pricing for specialist requirements, complex
                premises, or expedited delivery. Specific quotations may fall
                outside these ranges based on factors not captured by this
                calculator. Updated May 2026.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/electrical-testing"
                className="text-bcg-sage hover:underline"
              >
                Read more in the Electrical Testing pillar →
              </Link>
            </div>
          </div>
        )}

        <section className="mt-16 pt-8 border-t border-bcg-mist">
          <h2 className="font-serif text-2xl mb-4">How this works</h2>
          <p className="text-bcg-ink mb-4 leading-relaxed">
            The frequency recommendation is drawn from IET Guidance Note 3
            risk-based intervals. Most commercial premises operate on a
            5-year cycle as the BS 7671 maximum interval; industrial,
            warehouse, and older installations typically warrant a 3-year
            cycle; healthcare clinical areas may need annual inspection; HMOs
            licensed under the 2020 Regulations have a statutory 5-year
            requirement.
          </p>
          <p className="text-bcg-ink leading-relaxed">
            The cost estimate uses typical UK market rates for routine EICR
            work, with the upper range accommodating premium environments
            (healthcare, industrial), out-of-hours premiums, and the
            variable cost of report writing time on larger installations.
            Circuit count is estimated from floor area and distribution board
            count where you don&apos;t know the figure yourself. Remedial
            work is not included in the estimate — that varies enormously by
            installation and is the unknown that surprises most premises
            managers.
          </p>
        </section>
      </div>
    </main>
  );
}
