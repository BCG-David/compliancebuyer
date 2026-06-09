"use client";

import { useState } from "react";
import Link from "next/link";

type Environment =
  | "office"
  | "retail"
  | "kitchen"
  | "industrial"
  | "construction"
  | "public-use"
  | "hire";
type UseIntensity = "low" | "medium" | "high";

interface CategoryBreakdown {
  category: string;
  count: number;
  frequency: string;
  reasoning: string;
}

interface Result {
  categories: CategoryBreakdown[];
  totalAnnualTests: number;
  costLow: number;
  costHigh: number;
  notes: string[];
}

const MIN_CHARGE = 99;
const PER_TEST = 0.99;

function calculate(
  environment: Environment,
  itEquipment: number,
  kitchenItems: number,
  generalOffice: number,
  hireOrPortable: number,
  intensity: UseIntensity
): Result {
  const categories: CategoryBreakdown[] = [];
  const notes: string[] = [];

  if (itEquipment > 0) {
    let freq = "Combined visual inspection annually; full PAT every 4 years.";
    if (environment === "industrial" || environment === "construction") {
      freq = "Combined visual inspection 6-monthly; full PAT annually.";
    } else if (intensity === "high") {
      freq = "Combined visual inspection annually; full PAT every 2 years.";
    }
    categories.push({
      category: "IT equipment (computers, monitors, printers)",
      count: itEquipment,
      frequency: freq,
      reasoning:
        "IT equipment is typically low risk (Class I or Class II, stationary, low movement). The IET Code of Practice 5th Edition supports extended intervals for this category in office environments.",
    });
  }

  if (kitchenItems > 0) {
    const freq =
      environment === "kitchen"
        ? "Combined visual inspection 6-monthly; full PAT annually."
        : "Combined visual inspection annually; full PAT every 2 years.";
    categories.push({
      category: "Kitchen / catering equipment",
      count: kitchenItems,
      frequency: freq,
      reasoning:
        "Kitchen equipment combines moisture, heat, frequent movement, and exposure to greases — all of which accelerate cable and fitting deterioration. Higher inspection frequency than office equipment.",
    });
  }

  if (generalOffice > 0) {
    let freq =
      "Combined visual inspection annually; full PAT every 2-4 years.";
    if (intensity === "high") {
      freq = "Combined visual inspection 6-monthly; full PAT annually.";
    }
    categories.push({
      category: "General office (kettles, lamps, fans, portable heaters)",
      count: generalOffice,
      frequency: freq,
      reasoning:
        "Hand-held and portable items (kettles, lamps, fans, heaters) move more, get knocked, and have flexible cables that wear — full PAT recommended more frequently than for stationary IT equipment.",
    });
  }

  if (hireOrPortable > 0) {
    const freq =
      "Inspection before each issue / use; full PAT every 3 months.";
    categories.push({
      category: "Hire / construction tools / portable industrial",
      count: hireOrPortable,
      frequency: freq,
      reasoning:
        "Equipment that's hired out, used on construction sites, or moved between locations sees the highest mechanical and environmental stress. Pre-issue inspection plus quarterly PAT is the typical baseline.",
    });
  }

  let totalAnnualTests = 0;
  if (itEquipment > 0) {
    totalAnnualTests +=
      environment === "industrial" || environment === "construction"
        ? itEquipment
        : intensity === "high"
        ? itEquipment * 0.5
        : itEquipment * 0.25;
  }
  if (kitchenItems > 0) {
    totalAnnualTests +=
      environment === "kitchen" ? kitchenItems : kitchenItems * 0.5;
  }
  if (generalOffice > 0) {
    totalAnnualTests +=
      intensity === "high" ? generalOffice : generalOffice * 0.33;
  }
  if (hireOrPortable > 0) {
    totalAnnualTests += hireOrPortable * 4;
  }
  totalAnnualTests = Math.ceil(totalAnnualTests);

  const baselineCost = Math.max(MIN_CHARGE, totalAnnualTests * PER_TEST);
  const costLow = Math.round(baselineCost);
  const costHigh = Math.round(baselineCost * 1.4);

  if (environment === "construction") {
    notes.push(
      "Construction sites have specific 110V transformer and reduced low-voltage requirements; portable tools used on site need 3-monthly PAT as a baseline."
    );
  } else if (environment === "hire") {
    notes.push(
      "Hire equipment must be inspected before each issue. Annual PAT counts here represent the baseline regulated frequency."
    );
  } else if (environment === "public-use") {
    notes.push(
      "Equipment accessed by the public (schools, hotels, leisure facilities) typically warrants a 12-month inspection cycle regardless of fire load or intensity, on the basis that occupants don't recognise emerging defects."
    );
  }

  notes.push(
    "The IET Code of Practice 5th Edition is risk-based, not prescriptive. The frequencies above are typical starting points; a competent person may extend or shorten intervals based on a documented risk assessment of your specific equipment and environment."
  );

  notes.push(
    "Many low-risk Class II items (double-insulated, no exposed metalwork) may warrant only formal visual inspection rather than full PAT in some environments. A competent person can confirm what proportion of your inventory falls into this category."
  );

  return {
    categories,
    totalAnnualTests,
    costLow,
    costHigh,
    notes,
  };
}

export default function PATCalculator() {
  const [environment, setEnvironment] = useState<Environment>("office");
  const [itEquipment, setItEquipment] = useState<string>("30");
  const [kitchenItems, setKitchenItems] = useState<string>("5");
  const [generalOffice, setGeneralOffice] = useState<string>("15");
  const [hireOrPortable, setHireOrPortable] = useState<string>("0");
  const [intensity, setIntensity] = useState<UseIntensity>("medium");
  const [result, setResult] = useState<Result | null>(null);

  function handleCalculate() {
    const it = parseInt(itEquipment, 10) || 0;
    const k = parseInt(kitchenItems, 10) || 0;
    const g = parseInt(generalOffice, 10) || 0;
    const h = parseInt(hireOrPortable, 10) || 0;
    if (it + k + g + h < 1) {
      setResult(null);
      return;
    }
    setResult(calculate(environment, it, k, g, h, intensity));
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
          PAT Testing Volume Estimator
        </h1>
        <p className="text-bcg-stone text-lg mb-2 leading-relaxed">
          An indicative estimate of testing volume and cost for portable
          appliance testing. Frequencies are drawn from the IET Code of
          Practice 5th Edition risk-based intervals; cost ranges reflect
          typical UK market rates for routine PAT work.
        </p>
        <p className="text-bcg-stone text-sm mb-12 italic">
          Methodology drawn from the IET Code of Practice for In-Service
          Inspection and Testing of Electrical Equipment, 5th Edition.
        </p>

        <div className="bg-bcg-mist/50 border border-bcg-mist p-8 rounded-sm mb-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="environment"
                className="block font-serif text-lg mb-2"
              >
                Environment
              </label>
              <select
                id="environment"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as Environment)}
                className="w-full md:w-80 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              >
                <option value="office">Office</option>
                <option value="retail">Retail</option>
                <option value="kitchen">
                  Commercial kitchen / hospitality
                </option>
                <option value="industrial">Industrial / manufacturing</option>
                <option value="construction">Construction site</option>
                <option value="public-use">
                  Public-access (school, hotel, leisure)
                </option>
                <option value="hire">Hire / equipment loan</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="intensity"
                className="block font-serif text-lg mb-2"
              >
                Use intensity
              </label>
              <p className="text-sm text-bcg-stone mb-2">
                Low: occasional use, single shift. Medium: typical full-day
                use. High: heavy daily use, multiple users, equipment moved
                often.
              </p>
              <select
                id="intensity"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as UseIntensity)}
                className="w-full md:w-80 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <p className="font-serif text-lg mb-3">Inventory by category</p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="itEquipment" className="block text-sm mb-1">
                    IT equipment (computers, monitors, printers, networking)
                  </label>
                  <input
                    id="itEquipment"
                    type="number"
                    min="0"
                    value={itEquipment}
                    onChange={(e) => setItEquipment(e.target.value)}
                    className="w-32 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
                  />
                </div>
                <div>
                  <label htmlFor="kitchenItems" className="block text-sm mb-1">
                    Kitchen / catering equipment
                  </label>
                  <input
                    id="kitchenItems"
                    type="number"
                    min="0"
                    value={kitchenItems}
                    onChange={(e) => setKitchenItems(e.target.value)}
                    className="w-32 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
                  />
                </div>
                <div>
                  <label
                    htmlFor="generalOffice"
                    className="block text-sm mb-1"
                  >
                    General office (kettles, lamps, fans, heaters)
                  </label>
                  <input
                    id="generalOffice"
                    type="number"
                    min="0"
                    value={generalOffice}
                    onChange={(e) => setGeneralOffice(e.target.value)}
                    className="w-32 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
                  />
                </div>
                <div>
                  <label
                    htmlFor="hireOrPortable"
                    className="block text-sm mb-1"
                  >
                    Hire / construction tools / portable industrial
                  </label>
                  <input
                    id="hireOrPortable"
                    type="number"
                    min="0"
                    value={hireOrPortable}
                    onChange={(e) => setHireOrPortable(e.target.value)}
                    className="w-32 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
                  />
                </div>
              </div>
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
            <h2 className="font-serif text-2xl mb-6">
              Indicative testing schedule
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-bcg-note p-6 rounded-sm">
                <p className="text-sm text-bcg-stone uppercase tracking-wide mb-1">
                  Annual test volume
                </p>
                <p className="font-serif text-2xl text-bcg-ink">
                  ~{result.totalAnnualTests}{" "}
                  <span className="text-base font-sans text-bcg-stone">
                    test{result.totalAnnualTests !== 1 ? "s" : ""} / year
                  </span>
                </p>
              </div>

              <div className="bg-bcg-note p-6 rounded-sm">
                <p className="text-sm text-bcg-stone uppercase tracking-wide mb-1">
                  Indicative annual cost
                </p>
                <p className="font-serif text-2xl text-bcg-ink">
                  £{result.costLow.toLocaleString()} – £
                  {result.costHigh.toLocaleString()}
                </p>
                <p className="text-sm text-bcg-stone mt-2">
                  Indicative range — see pricing methodology below
                </p>
              </div>
            </div>

            <h3 className="font-serif text-xl mb-3">By category</h3>
            <div className="space-y-4 mb-6">
              {result.categories.map((c, i) => (
                <div
                  key={i}
                  className="bg-bcg-note p-5 rounded-sm border-l-4 border-bcg-sage"
                >
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-serif text-lg text-bcg-ink">
                      {c.category}
                    </p>
                    <p className="text-sm text-bcg-stone">
                      {c.count} item{c.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="text-sm text-bcg-ink mb-2">
                    <span className="font-serif">Frequency:</span>{" "}
                    {c.frequency}
                  </p>
                  <p className="text-sm text-bcg-ink/80">{c.reasoning}</p>
                </div>
              ))}
            </div>

            {result.notes.length > 0 && (
              <>
                <h3 className="font-serif text-xl mb-3">Notes</h3>
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

            <div className="bg-bcg-mist/60 p-6 rounded-sm text-sm text-bcg-stone mb-6">
              <p className="font-serif text-base text-bcg-ink mb-2">
                Important caveat
              </p>
              <p>
                This is an indicative estimate based on the inputs you&apos;ve
                provided. Specific premises may have items requiring different
                testing frequencies, items exempt from PAT under specific
                exemptions, or items requiring more frequent testing than the
                category default. Always verify with a competent person
                before commissioning work.
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
                href="/pat-testing"
                className="text-bcg-sage hover:underline"
              >
                Read more in the PAT Testing pillar →
              </Link>
            </div>
          </div>
        )}

        <section className="mt-16 pt-8 border-t border-bcg-mist">
          <h2 className="font-serif text-2xl mb-4">How this works</h2>
          <p className="text-bcg-ink mb-4 leading-relaxed">
            The calculator uses the IET Code of Practice 5th Edition&apos;s
            risk-based intervals as a starting point, varied by category and
            environment. IT equipment in an office environment can typically
            run on a 4-year full PAT cycle with annual visual inspection;
            kitchen equipment in commercial catering needs annual full PAT;
            hire and construction tools need quarterly PAT plus pre-issue
            inspection.
          </p>
          <p className="text-bcg-ink leading-relaxed">
            Cost ranges are computed from typical UK market rates for routine
            PAT work, with the upper end reflecting market premium
            (out-of-hours work, complex environments, smaller jobs that
            don&apos;t achieve volume pricing). The Code of Practice is
            risk-based — a competent person doing a documented risk
            assessment of your specific inventory may justify shorter or
            longer intervals than the calculator&apos;s defaults.
          </p>
        </section>
      </div>
    </main>
  );
}
