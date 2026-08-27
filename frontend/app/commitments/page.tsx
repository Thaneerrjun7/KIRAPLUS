"use client";

// Editable commitment table, aggregate card, obligations breakdown.
// Reads from the already-loaded Profile.commitments; no separate endpoint. See
// frontend/docs/architecture.md's Commitments component spec.

import { useEffect, useState } from "react";
import { CommitmentsTable } from "@/components/CommitmentsTable";
import { Button } from "@/components/ui/Button";
import { loadProfile, saveProfile } from "@/lib/api";
import type { Commitment, Profile } from "@/lib/fixtures";
import { getStoredProfileId } from "@/lib/profileStorage";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export default function CommitmentsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const profileId = getStoredProfileId();
    if (profileId === null) return;
    loadProfile(profileId)
      .then(setProfile)
      .catch((err) => setError(errorMessage(err)));
  }, []);

  if (error && profile === null) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <h1 className="font-display text-3xl">Commitments</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  if (profile === null) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <h1 className="font-display text-3xl">Commitments</h1>
        <p>Save a profile first on the Profile page before editing commitments.</p>
      </main>
    );
  }

  const handleChange = (commitments: Commitment[]) => {
    setProfile({ ...profile, commitments });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const result = await saveProfile(profile);
      setProfile({ ...profile, profile_id: result.profile_id });
      setSaved(true);
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
      <h1 className="font-display text-3xl">Commitments</h1>
      {saved && <p role="status" className="mt-2">Commitments saved.</p>}
      {error && <p role="alert" className="mt-2">{error}</p>}
      <div className="mt-6">
        <CommitmentsTable commitments={profile.commitments} onChange={handleChange} />
      </div>
      <Button onClick={handleSave} className="mt-6">
        Save changes
      </Button>
    </main>
  );
}
