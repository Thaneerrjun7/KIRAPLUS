"use client";

// Score gauge, band, six-factor breakdown, warning flags, plain-language explanation.
// Calls POST /assess and POST /explain. See docs/API-CONTRACT.md §3, §5.

import { useEffect, useState } from "react";
import { FactorBreakdown } from "@/components/FactorBreakdown";
import { ScoreGauge } from "@/components/ScoreGauge";
import { WarningList } from "@/components/WarningList";
import { assess, explain, loadProfile, type Assessment } from "@/lib/api";
import { rankFactorsByLostContribution } from "@/lib/factorConfig";
import type { Profile } from "@/lib/fixtures";
import { getStoredProfileId } from "@/lib/profileStorage";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
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
    let cancelled = false;

    assess(profile)
      .then((result) => {
        if (cancelled) return;
        setAssessment(result);
        setError(null);

        // llm_service.explain never raises by contract (§5) -- if it does today, that's only
        // because it isn't implemented yet. Best-effort: omit the explanation, don't block the
        // score/factors/warnings that already rendered successfully.
        explain({
          score: result.score,
          band: result.band,
          score_after: result.score,
          band_after: result.band,
          buffer_before_sen: result.features.buffer_sen,
          buffer_after_sen: result.features.buffer_sen,
          currency: "MYR",
          factors: rankFactorsByLostContribution(result.subscores, result.contributions),
          warnings: result.warnings.map((w) => w.code),
          p_stress_12m: result.p_stress_12m,
          purchase: null,
        })
          .then((exp) => {
            if (!cancelled) setExplanation(exp.text);
          })
          .catch(() => {
            /* best-effort -- see comment above */
          });
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      });

    return () => {
      cancelled = true;
    };
  }, [profile]);

  if (profile === null && error === null) {
    return (
      <main>
        <h1>Dashboard</h1>
        <p>Save a profile first on the Profile page to see your score.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Dashboard</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  if (assessment === null) {
    return (
      <main>
        <h1>Dashboard</h1>
        <p>Loading your assessment…</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <ScoreGauge score={assessment.score} band={assessment.band} />
      <FactorBreakdown
        subscores={assessment.subscores}
        contributions={assessment.contributions}
        features={assessment.features}
      />
      <WarningList warnings={assessment.warnings} />
      {explanation && <p>{explanation}</p>}
      <p className="text-sm text-navy/70">{assessment.disclaimer}</p>
    </main>
  );
}
