"use client";

// Score gauge, band, six-factor breakdown, warning flags, plain-language explanation.
// Calls POST /assess and POST /explain. See docs/API-CONTRACT.md §3, §5.

import { useEffect, useState } from "react";
import { FactorBreakdown } from "@/components/FactorBreakdown";
import { ScoreGauge } from "@/components/ScoreGauge";
import { WarningList } from "@/components/WarningList";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
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
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p>Save a profile first on the Profile page to see your score.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  if (assessment === null) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p>
          <Spinner className="mr-2" />
          Loading your assessment…
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
      <h1 className="font-display text-3xl">Dashboard</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
        <Card label="SCORE" className="p-6">
          <div className="flex flex-col items-center">
            <ScoreGauge score={assessment.score} band={assessment.band} />
          </div>
          <p className="mt-5 border-t border-dashed border-border pt-3.5 text-xs leading-relaxed text-mist">
            {assessment.disclaimer}
          </p>
        </Card>
        <FactorBreakdown
          subscores={assessment.subscores}
          contributions={assessment.contributions}
          features={assessment.features}
        />
      </div>
      <Card label="WARNINGS" className="mt-6 p-6">
        <WarningList warnings={assessment.warnings} />
      </Card>
      {explanation && (
        <Card label="WHAT THIS MEANS" className="mt-6 p-6">
          <p className="leading-relaxed">{explanation}</p>
        </Card>
      )}
    </main>
  );
}
