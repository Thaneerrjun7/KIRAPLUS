"use client";

// Editable commitment table, aggregate card, obligations breakdown.
// Reads from the already-loaded Profile.commitments; no separate endpoint. See
// frontend/docs/architecture.md's Commitments component spec.

import { useEffect, useState } from "react";
import { CommitmentsTable } from "@/components/CommitmentsTable";
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
      <main>
        <h1>Commitments</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  if (profile === null) {
    return (
      <main>
        <h1>Commitments</h1>
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
    <main>
      <h1>Commitments</h1>
      {saved && <p role="status">Commitments saved.</p>}
      {error && <p role="alert">{error}</p>}
      <CommitmentsTable commitments={profile.commitments} onChange={handleChange} />
      <button type="button" onClick={handleSave}>
        Save changes
      </button>
    </main>
  );
}
