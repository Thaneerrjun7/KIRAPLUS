"use client";

// Purchase input, before/after comparison, verdict banner, tenure alternatives.
// Calls POST /simulate/grid once per page load / price change; the tenure slider reads the
// already-fetched grid locally (SimulatorPanel), no further requests while dragging.
// See docs/API-CONTRACT.md §4, §9, and frontend/docs/architecture.md's Simulator component spec.

import { useEffect, useState } from "react";
import { SimulatorPanel } from "@/components/SimulatorPanel";
import { assess, loadProfile, simulateGrid, type GridEntry } from "@/lib/api";
import { toSen } from "@/lib/format";
import type { Band, Profile } from "@/lib/fixtures";
import { getStoredProfileId } from "@/lib/profileStorage";

const DEFAULT_PRICE_RINGGIT = "2400";
const DEFAULT_TENURE = 12;

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export default function SimulatorPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [baseline, setBaseline] = useState<{ score: number; band: Band; bufferSen: number } | null>(
    null
  );
  const [priceRinggit, setPriceRinggit] = useState(DEFAULT_PRICE_RINGGIT);
  const [tenure, setTenure] = useState(DEFAULT_TENURE);
  const [grid, setGrid] = useState<GridEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const profileId = getStoredProfileId();
    if (profileId === null) return;
    loadProfile(profileId)
      .then(setProfile)
      .catch((err) => setError(errorMessage(err)));
  }, []);

  useEffect(() => {
    if (!profile) return;
    assess(profile)
      .then((result) =>
        setBaseline({
          score: result.score,
          band: result.band,
          bufferSen: result.features.buffer_sen,
        })
      )
      .catch((err) => setError(errorMessage(err)));
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    const priceSen = toSen(Number(priceRinggit) || 0);
    if (priceSen <= 0) return;
    simulateGrid(profile, priceSen)
      .then(setGrid)
      .catch((err) => setError(errorMessage(err)));
  }, [profile, priceRinggit]);

  if (profile === null && error === null) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <h1 className="font-display text-3xl">Simulator</h1>
        <p>Save a profile first on the Profile page to try a purchase.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <h1 className="font-display text-3xl">Simulator</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
      <h1 className="font-display text-3xl">Simulator</h1>
      <div className="mt-6 max-w-xs">
        <label htmlFor="purchase-price" className="block text-sm font-medium text-slate">
          Purchase price (RM)
        </label>
        <input
          id="purchase-price"
          type="number"
          value={priceRinggit}
          onChange={(e) => setPriceRinggit(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm tabular-nums focus:border-teal focus:outline-none"
        />
      </div>

      <div className="mt-6">
        {baseline && grid ? (
          <SimulatorPanel
            grid={grid}
            tenure={tenure}
            onTenureChange={setTenure}
            bandBefore={baseline.band}
            scoreBefore={baseline.score}
            bufferBeforeSen={baseline.bufferSen}
          />
        ) : (
          <p>Loading&hellip;</p>
        )}
      </div>
    </main>
  );
}
