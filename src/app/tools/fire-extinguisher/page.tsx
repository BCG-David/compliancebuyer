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
  | "other";
type FireLoad = "low" | "medium" | "high";

interface ExtinguisherSpec {
  type: string;
  rating: string;
  quantity: number;
  reasoning: string;
}

interface Result {
  extinguishers: ExtinguisherSpec[];
  notes: string[];
  totalCount: number;
}

function calculate(
  premises: PremisesType,
  floorArea: number,
  floors: number,
  fireLoad: FireLoad,
  hasKitchen: boolean,
  hasElectrical: boolean,
  hasFlammableLiquids: boolean,
  hasMetals: boolean
): Result {
  const extinguishers: ExtinguisherSpec[] = [];
  const notes: string[] = [];

  // BS 5306-8 baseline: 26A per 200m² for low fire load, scaled up for higher loads.
  // Each 9-litre water/foam extinguisher provides ~13A. The 26A figure represents
  // two units per 200m² as a starting point; the calculation below is per floor.

  const ratingNeeded =
    fireLoad === "low" ? 26 : fireLoad === "medium" ? 39 : 52;

  // Per floor, calculate Class A coverage
  const areaPerFloor = floorArea / floors;
  const class13ARequired =
    Math.ceil((ratingNeeded * areaPerFloor) / (200 * 13)) * floors;

  // BS 5306-8 also requires a minimum of two Class A units per floor on most premises
  const minClassAPerFloor = 2;
  const totalClassA = Math.max(class13ARequired, minClassAPerFloor * floors);

  extinguishers.push({
    type: "Water or foam (9-litre)",
    rating: "13A minimum each",
    quantity: totalClassA,
    reasoning: `Class A coverage for ${areaPerFloor.toFixed(0)} m² per floor × ${floors} floor${floors > 1 ? "s" : ""}, ${fireLoad} fire load. BS 5306-8 starting figure.`,
  });

  if (floors > 1) {
    notes.push(
      `Each floor needs its own Class A coverage — extinguishers cannot be shared between floors. Minimum two per floor regardless of area.`
    );
  }

  // Travel distance check
  if (areaPerFloor > 400) {
    notes.push(
      "BS 5306-8 sets a maximum travel distance of 30m to the nearest Class A extinguisher. Larger floors need more units distributed throughout the space, not concentrated at one point."
    );
  }

  // Class F (kitchens with cooking oils)
  if (hasKitchen) {
    extinguishers.push({
      type: "Wet chemical (Class F, 6-litre)",
      rating: "75F",
      quantity: 1,
      reasoning:
        "Commercial kitchen with cooking oils requires a Class F wet chemical extinguisher within 10m of the cooking equipment. Water and foam are not suitable for cooking oil fires.",
    });
    notes.push(
      "Wet chemical (Class F) must be sited within 10m of the cooking equipment. Never use water or foam on a cooking oil fire — the fat will boil and erupt."
    );
  }

  // CO2 (electrical)
  if (hasElectrical) {
    const co2Quantity = Math.max(1, Math.ceil(floors));
    extinguishers.push({
      type: "CO2 (2kg or 5kg)",
      rating: "Class B + electrical safe",
      quantity: co2Quantity,
      reasoning:
        "Concentrations of electrical equipment (server rooms, switch rooms, electrical intake) need CO2 nearby — leaves no residue on equipment and is safe on live electrical fires up to 1000V.",
    });
    notes.push(
      "CO2 should be sited near electrical risk points (server rooms, electrical intake rooms, switch rooms). Do not use foam or water on live electrical equipment."
    );
  }

  // Class B (flammable liquids)
  if (hasFlammableLiquids) {
    extinguishers.push({
      type: "Foam (6-litre AFFF)",
      rating: "21B minimum",
      quantity: 1,
      reasoning:
        "Class B flammable liquid storage (fuels, solvents, petrol) requires foam coverage. Foam smothers the fuel surface; water alone will spread the fire.",
    });
    notes.push(
      "Class B fires (flammable liquids) require foam, not water. Powder is also effective but creates significant clean-up and visibility issues indoors."
    );
  }

  // Class D (metals)
  if (hasMetals) {
    extinguishers.push({
      type: "Specialist Class D dry powder",
      rating: "Class D",
      quantity: 1,
      reasoning:
        "Combustible metals (magnesium, lithium, sodium, aluminium swarf) require specialist Class D powder. Standard ABC powder will react violently.",
    });
    notes.push(
      "Class D metals are a specialist hazard. Standard powder, water, foam, and CO2 are all unsafe on burning metals. Take specific advice on the correct media for your specific metal."
    );
  }

  // Premises-specific guidance
  if (premises === "healthcare") {
    notes.push(
      "Healthcare premises have specific HTM 05-03 guidance on portable extinguisher provision — verify against the relevant Health Technical Memorandum, especially for inpatient or vulnerable-occupant areas."
    );
  } else if (premises === "education") {
    notes.push(
      "Education premises are typically Class A dominant but practical/science labs and design technology areas may add specific risks (chemicals, hot work, metalworking) requiring additional provision."
    );
  } else if (premises === "hospitality") {
    notes.push(
      "Hospitality premises typically combine kitchen (Class F), bar (Class B for spirits), and accommodation (Class A) — provision needs to cover all three categories."
    );
  } else if (premises === "industrial" || premises === "warehouse") {
    notes.push(
      "Industrial and warehouse premises often have higher fire loads than the inputs alone capture (palletised storage, racking height, packaging materials). Consider a higher Class A rating than the calculator's baseline if your fire load is unusual."
    );
  }

  const totalCount = extinguishers.reduce((sum, e) => sum + e.quantity, 0);

  return {
    extinguishers,
    notes,
    totalCount,
  };
}

export default function FireExtinguisherCalculator() {
  const [premises, setPremises] = useState<PremisesType>("office");
  const [floorArea, setFloorArea] = useState<string>("400");
  const [floors, setFloors] = useState<string>("2");
  const [fireLoad, setFireLoad] = useState<FireLoad>("low");
  const [hasKitchen, setHasKitchen] = useState(false);
  const [hasElectrical, setHasElectrical] = useState(false);
  const [hasFlammableLiquids, setHasFlammableLiquids] = useState(false);
  const [hasMetals, setHasMetals] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  function handleCalculate() {
    const area = parseFloat(floorArea);
    const flrs = parseInt(floors, 10);
    if (isNaN(area) || isNaN(flrs) || area < 1 || flrs < 1) {
      setResult(null);
      return;
    }
    setResult(
      calculate(
        premises,
        area,
        flrs,
        fireLoad,
        hasKitchen,
        hasElectrical,
        hasFlammableLiquids,
        hasMetals
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
          Fire Extinguisher Calculator
        </h1>
        <p className="text-bcg-stone text-lg mb-2 leading-relaxed">
          An indicative provision schedule based on BS 5306-8 baseline figures
          for portable fire extinguisher selection and installation. Output is
          a starting point for discussion with a competent surveyor, not a
          finished specification.
        </p>
        <p className="text-bcg-stone text-sm mb-12 italic">
          Methodology drawn from BS 5306-8: Fire extinguishing installations
          and equipment on premises — Selection and positioning of portable
          fire extinguishers — Code of practice.
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
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="floorArea"
                  className="block font-serif text-lg mb-2"
                >
                  Total floor area (m²)
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
                  htmlFor="floors"
                  className="block font-serif text-lg mb-2"
                >
                  Number of floors
                </label>
                <input
                  id="floors"
                  type="number"
                  min="1"
                  value={floors}
                  onChange={(e) => setFloors(e.target.value)}
                  className="w-full px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="fireLoad"
                className="block font-serif text-lg mb-2"
              >
                Class A fire load
              </label>
              <p className="text-sm text-bcg-stone mb-2">
                Low: typical office, modern retail. Medium: storage, archives,
                paper-heavy environments. High: warehousing, racked storage,
                significant combustible materials.
              </p>
              <select
                id="fireLoad"
                value={fireLoad}
                onChange={(e) => setFireLoad(e.target.value as FireLoad)}
                className="w-full md:w-80 px-3 py-2 border border-bcg-stone/30 bg-bcg-paper rounded-sm focus:outline-none focus:border-bcg-sage"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <p className="font-serif text-lg mb-3">Specific risks present</p>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasKitchen}
                    onChange={(e) => setHasKitchen(e.target.checked)}
                    className="mr-3 w-4 h-4 accent-bcg-sage"
                  />
                  <span>Commercial kitchen with cooking oils</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasElectrical}
                    onChange={(e) => setHasElectrical(e.target.checked)}
                    className="mr-3 w-4 h-4 accent-bcg-sage"
                  />
                  <span>
                    Significant electrical equipment (server room, switch
                    room, plant room)
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasFlammableLiquids}
                    onChange={(e) =>
                      setHasFlammableLiquids(e.target.checked)
                    }
                    className="mr-3 w-4 h-4 accent-bcg-sage"
                  />
                  <span>
                    Class B flammable liquid storage (fuels, solvents, paint)
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasMetals}
                    onChange={(e) => setHasMetals(e.target.checked)}
                    className="mr-3 w-4 h-4 accent-bcg-sage"
                  />
                  <span>
                    Class D combustible metals (magnesium, lithium, sodium)
                  </span>
                </label>
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
            <h2 className="font-serif text-2xl mb-2">
              Indicative extinguisher schedule
            </h2>
            <p className="text-bcg-stone mb-6">
              {result.totalCount} extinguisher
              {result.totalCount !== 1 ? "s" : ""} total across{" "}
              {result.extinguishers.length} categor
              {result.extinguishers.length !== 1 ? "ies" : "y"}.
            </p>

            <div className="space-y-4 mb-8">
              {result.extinguishers.map((e, i) => (
                <div
                  key={i}
                  className="bg-bcg-note p-5 rounded-sm border-l-4 border-bcg-sage"
                >
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <p className="font-serif text-lg text-bcg-ink">
                      {e.quantity} × {e.type}
                    </p>
                    <p className="text-sm text-bcg-stone uppercase tracking-wide">
                      {e.rating}
                    </p>
                  </div>
                  <p className="text-sm text-bcg-ink/80">{e.reasoning}</p>
                </div>
              ))}
            </div>

            {result.notes.length > 0 && (
              <>
                <h3 className="font-serif text-xl mb-3">Positioning notes</h3>
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

            <div className="bg-bcg-mist/60 p-6 rounded-sm text-sm text-bcg-stone">
              <p className="font-serif text-base text-bcg-ink mb-2">
                Important caveat
              </p>
              <p>
                This is an indicative estimate based on the inputs you've
                provided. Specific premises may have requirements not captured
                by this tool — including layout obstructions, travel distance
                in practice, fire-resistance considerations, and BS 5306-8
                positioning rules that depend on visibility and accessibility
                of the equipment. A competent surveyor (BAFE SP101 or
                equivalent) should produce the final schedule and confirm
                positioning. Annual servicing and 5-year extended service are
                separate ongoing requirements.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/fire-extinguishers"
                className="text-bcg-sage hover:underline"
              >
                Read more in the Fire Extinguishers pillar →
              </Link>
            </div>
          </div>
        )}

        <section className="mt-16 pt-8 border-t border-bcg-mist">
          <h2 className="font-serif text-2xl mb-4">How this works</h2>
          <p className="text-bcg-ink mb-4 leading-relaxed">
            BS 5306-8 sets a baseline of 26A of Class A coverage per 200 m² for
            low fire load environments, with proportional uplifts for medium
            and high fire loads. A standard 9-litre water or foam extinguisher
            provides 13A; the calculator translates total rating required into
            unit count, then applies the BS 5306-8 minimum of two Class A units
            per floor regardless of area.
          </p>
          <p className="text-bcg-ink mb-4 leading-relaxed">
            Specific class additions are layered on top: Class F wet chemical
            within 10m of any commercial cooking, CO2 near electrical
            concentrations, foam for flammable liquids, specialist powder for
            combustible metals. The calculator does not account for layout
            obstructions, sightlines, the 30m and 10m maximum travel distance
            rules in practice (which depend on the specific room layout), or
            fire-resistance considerations — these are part of a competent
            survey and cannot be computed from the inputs here.
          </p>
        </section>
      </div>
    </main>
  );
}
