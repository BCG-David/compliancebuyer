"use client";

import { useState } from "react";
import Link from "next/link";

type HazardLevel = "low" | "higher";
type Layout = "single-floor" | "multi-floor" | "multi-site" | "dispersed";
type ShiftPattern = "single" | "multi-shift" | "lone" | "24-hour";
type Distance = "urban" | "suburban" | "rural";
type PublicAccess = "significant" | "occasional" | "none";

interface Result {
  qualification: "EFAW" | "FAW" | "FAW + Appointed Persons";
  minimumNumber: number;
  recommendedNumber: number;
  reasoning: string[];
  shiftConsideration: string | null;
}

function calculate(
  workforce: number,
  hazard: HazardLevel,
  layout: Layout,
  shifts: ShiftPattern,
  distance: Distance,
  publicAccess: PublicAccess
): Result {
  const reasoning: string[] = [];

  // Baseline ratios drawn from HSE L74 starting points for needs assessment.
  // These are not statutory minimums — L74 is needs-based, not prescriptive.
  let qualification: Result["qualification"] = hazard === "low" ? "EFAW" : "FAW";
  let ratio = hazard === "low" ? 50 : 25;

  reasoning.push(
    hazard === "low"
      ? "Lower-hazard environments (typical office, retail, light commercial) take Emergency First Aid at Work as a baseline."
      : "Higher-hazard environments (industrial, construction, work with machinery, chemicals, or significant manual handling) take First Aid at Work as a baseline."
  );

  // Distance to emergency services pushes upward
  if (distance === "rural") {
    ratio = Math.max(20, ratio - 10);
    reasoning.push(
      "Rural location means longer ambulance response times — coverage scaled up to compensate."
    );
  } else if (distance === "suburban" && hazard === "higher") {
    ratio = Math.max(20, ratio - 5);
    reasoning.push(
      "Suburban location combined with higher hazard means slower-than-urban response — modest uplift."
    );
  }

  // Public access — schools, retail, leisure, healthcare, etc.
  if (publicAccess === "significant") {
    ratio = Math.max(20, ratio - 10);
    reasoning.push(
      "Significant public access means first aiders may need to respond to incidents involving non-employees — coverage scaled up."
    );
  }

  let minimumNumber = Math.max(1, Math.ceil(workforce / ratio));
  let recommendedNumber = minimumNumber;

  // Layout adjustments — coverage must be reachable
  if (layout === "multi-floor") {
    recommendedNumber = Math.max(recommendedNumber, 2);
    reasoning.push(
      "Multiple floors mean a single first aider cannot reasonably be reached from every part of the premises — minimum two recommended for redundancy."
    );
  } else if (layout === "multi-site") {
    recommendedNumber = Math.max(recommendedNumber, 2);
    reasoning.push(
      "Multiple sites need separate coverage at each — the figure here is minimum total; each site needs its own competent first aider during occupied hours."
    );
  } else if (layout === "dispersed") {
    recommendedNumber = Math.max(recommendedNumber, 2);
    reasoning.push(
      "Dispersed working (lone or peripatetic staff) needs a different model — workers may need their own first aid arrangements; review against L74 needs assessment carefully."
    );
  }

  // Always recommend at least one Appointed Person backup
  if (workforce < 5 && hazard === "low") {
    qualification = "FAW + Appointed Persons";
    minimumNumber = 1;
    recommendedNumber = 1;
    reasoning.push(
      "Very small workforces may rely on Appointed Persons to call emergency services and oversee first aid arrangements; no qualified first aider is strictly required for under five low-hazard workers, but most organisations still train at least one."
    );
    qualification = "EFAW";
  }

  // Shift coverage — first aiders must be present when staff are present
  let shiftConsideration: string | null = null;
  if (shifts === "multi-shift") {
    shiftConsideration =
      "Multi-shift working means coverage must be present on every shift — the recommended number above must be met during each shift, not in total across the day. Multiply accordingly.";
  } else if (shifts === "24-hour") {
    shiftConsideration =
      "24-hour operation means first aiders must be present continuously, including nights and weekends — plan for at least one trained first aider per shift, with cover for absence.";
  } else if (shifts === "lone") {
    shiftConsideration =
      "Lone working introduces specific risks the standard ratio doesn't capture. Lone workers may need self-administered first aid training, check-in procedures, or personal alarms — first aider coverage alone is not sufficient.";
  }

  return {
    qualification,
    minimumNumber,
    recommendedNumber,
    reasoning,
    shiftConsideration,
  };
}

export default function FirstAiderCalculator() {
  const [workforce, setWorkforce] = useState<string>("25");
  const [hazard, setHazard] = useState<HazardLevel>("low");
  const [layout, setLayout] = useState<Layout>("single-floor");
  const [shifts, setShifts] = useState<ShiftPattern>("single");
  const [distance, setDistance] = useState<Distance>("urban");
  const [publicAccess, setPublicAccess] = useState<PublicAccess>("none");
  const [result, setResult] = useState<Result | null>(null);

  function handleCalculate() {
    const n = parseInt(workforce, 10);
    if (isNaN(n) || n < 1) {
      setResult(null);
      return;
    }
    setResult(calculate(n, hazard, layout, shifts, distance, publicAccess));
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
          First Aider Calculator
        </h1>
        <p className="text-bcg-stone text-lg mb-2 leading-relaxed">
          An indicative starting point for your first aid needs assessment under
          HSE L74. The output below is a recommendation, not a statutory
          minimum — needs assessment is your responsibility and may produce a
          different answer for reasons this tool cannot capture.
        </p>
        <p className="text-bcg-stone text-sm mb-12 italic">
          Methodology drawn from HSE publication L74 (First aid at work: The
          Health and Safety (First-Aid) Regulations 1981 — Approved Code of
          Practice and guidance).
        </p>

        <div className="bg-bcg-mist/50 border border-bcg-mist p-8 rounded-sm mb-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="workforce"
                className="block font-serif text-lg mb-2"
              >
                Workforce size
              </label>
              <p className="text-sm text-bcg-stone mb-2">
                Total number of employees typically present.
              </p>
              <input
                id="workforce"
                type="number"
                min="1"
                value={workforce}
                onChange={(e) => setWorkforce(e.target.value)}
                className="w-32 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              />
            </div>

            <div>
              <label htmlFor="hazard" className="block font-serif text-lg mb-2">
                Hazard profile
              </label>
              <p className="text-sm text-bcg-stone mb-2">
                Lower hazard: typical offices, retail, light commercial. Higher
                hazard: industrial, construction, machinery, chemicals,
                significant manual handling.
              </p>
              <select
                id="hazard"
                value={hazard}
                onChange={(e) => setHazard(e.target.value as HazardLevel)}
                className="w-full md:w-80 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              >
                <option value="low">Lower hazard</option>
                <option value="higher">Higher hazard</option>
              </select>
            </div>

            <div>
              <label htmlFor="layout" className="block font-serif text-lg mb-2">
                Premises layout
              </label>
              <select
                id="layout"
                value={layout}
                onChange={(e) => setLayout(e.target.value as Layout)}
                className="w-full md:w-80 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              >
                <option value="single-floor">Single floor</option>
                <option value="multi-floor">Multiple floors, single site</option>
                <option value="multi-site">Multiple sites</option>
                <option value="dispersed">
                  Dispersed / peripatetic working
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="shifts" className="block font-serif text-lg mb-2">
                Working pattern
              </label>
              <select
                id="shifts"
                value={shifts}
                onChange={(e) => setShifts(e.target.value as ShiftPattern)}
                className="w-full md:w-80 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              >
                <option value="single">Single shift / standard hours</option>
                <option value="multi-shift">Multiple shifts</option>
                <option value="lone">Significant lone working</option>
                <option value="24-hour">24-hour / continuous</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="distance"
                className="block font-serif text-lg mb-2"
              >
                Distance from emergency medical services
              </label>
              <select
                id="distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value as Distance)}
                className="w-full md:w-80 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              >
                <option value="urban">Urban — typical fast response</option>
                <option value="suburban">Suburban — moderate response</option>
                <option value="rural">Rural — longer response times</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="public"
                className="block font-serif text-lg mb-2"
              >
                Public access
              </label>
              <select
                id="public"
                value={publicAccess}
                onChange={(e) =>
                  setPublicAccess(e.target.value as PublicAccess)
                }
                className="w-full md:w-80 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              >
                <option value="none">None / employees only</option>
                <option value="occasional">Occasional visitors</option>
                <option value="significant">
                  Significant public footfall (retail, leisure, healthcare,
                  education)
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
            <h2 className="font-serif text-2xl mb-6">Indicative recommendation</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-bcg-note p-6 rounded-sm">
                <p className="text-sm text-bcg-stone uppercase tracking-wide mb-1">
                  Qualification level
                </p>
                <p className="font-serif text-2xl text-bcg-ink">
                  {result.qualification}
                </p>
                <p className="text-sm text-bcg-stone mt-2">
                  {result.qualification === "EFAW"
                    ? "Emergency First Aid at Work (1-day course)"
                    : result.qualification === "FAW"
                    ? "First Aid at Work (3-day course)"
                    : "FAW with Appointed Persons backup"}
                </p>
              </div>

              <div className="bg-bcg-note p-6 rounded-sm">
                <p className="text-sm text-bcg-stone uppercase tracking-wide mb-1">
                  Recommended number
                </p>
                <p className="font-serif text-2xl text-bcg-ink">
                  {result.recommendedNumber}{" "}
                  <span className="text-base font-sans text-bcg-stone">
                    trained first aider{result.recommendedNumber !== 1 ? "s" : ""}
                  </span>
                </p>
                {result.minimumNumber !== result.recommendedNumber && (
                  <p className="text-sm text-bcg-stone mt-2">
                    Ratio-based minimum: {result.minimumNumber}
                  </p>
                )}
              </div>
            </div>

            <h3 className="font-serif text-xl mb-3">How this was calculated</h3>
            <ul className="space-y-2 mb-6 text-bcg-ink">
              {result.reasoning.map((r, i) => (
                <li key={i} className="flex">
                  <span className="text-bcg-sage mr-3">·</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            {result.shiftConsideration && (
              <div className="bg-bcg-note border-l-4 border-bcg-sage p-4 mb-6">
                <p className="font-serif text-lg mb-1">Shift coverage note</p>
                <p className="text-bcg-ink">{result.shiftConsideration}</p>
              </div>
            )}

            <div className="bg-bcg-mist/60 p-6 rounded-sm text-sm text-bcg-stone">
              <p className="font-serif text-base text-bcg-ink mb-2">
                Important caveat
              </p>
              <p>
                This is an indicative estimate based on the inputs you've
                provided. Specific premises may have requirements not captured
                by this tool — including specific hazards, vulnerable workers,
                site geography, or insurer requirements. Always verify with a
                competent practitioner and document your needs assessment.
                Coverage must also account for absence (holidays, sickness) —
                most organisations train more first aiders than the minimum to
                ensure continuous cover.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/workplace-safety-training"
                className="text-bcg-sage hover:underline"
              >
                Read more in the Workplace Safety Training pillar →
              </Link>
            </div>
          </div>
        )}

        <section className="mt-16 pt-8 border-t border-bcg-mist">
          <h2 className="font-serif text-2xl mb-4">How this works</h2>
          <p className="text-bcg-ink mb-4 leading-relaxed">
            The calculator is built on the needs-assessment framework set out
            in HSE publication L74. Lower-hazard environments take EFAW with
            roughly one trained person per fifty employees as a starting point;
            higher-hazard environments take FAW with proportionally greater
            coverage. The starting ratios are then adjusted for layout
            (multi-floor and multi-site sites need redundancy), distance from
            emergency medical services (rural locations need more cover to
            compensate for slower ambulance response), and public access
            (premises serving the public may need to respond to non-employee
            incidents).
          </p>
          <p className="text-bcg-ink mb-4 leading-relaxed">
            The calculator does not factor in specific industry guidance (for
            example, construction sites have specific provisions under CDM
            2015), vulnerable workers, or insurer-specific requirements. Treat
            the output as a starting point for a documented needs assessment,
            not a substitute for one.
          </p>
        </section>
      </div>
    </main>
  );
}
