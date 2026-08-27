"use client";

// Seven-field form, four one-click demo personas.
// Calls POST /profiles and GET /profiles/demo/{name}. See docs/API-CONTRACT.md §2.

import { useEffect, useState } from "react";
import { ProfileForm, type DemoPersonaId } from "@/components/ProfileForm";
import { loadDemo, loadProfile, saveProfile } from "@/lib/api";
import type { Profile } from "@/lib/fixtures";
import { getStoredProfileId, setStoredProfileId } from "@/lib/profileStorage";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [formKey, setFormKey] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoCache, setDemoCache] = useState<Partial<Record<DemoPersonaId, Profile>>>({});

  useEffect(() => {
    const storedId = getStoredProfileId();
    if (storedId === null) return;
    loadProfile(storedId)
      .then((loaded) => {
        setProfile(loaded);
        setFormKey((key) => key + 1);
      })
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const handleLoadDemo = async (name: DemoPersonaId) => {
    try {
      // Demo personas are static fixtures (API-CONTRACT.md §7) -- cache client-side after first
      // load rather than re-fetching, per architecture.md's own reasoning for this open decision.
      const cached = demoCache[name];
      const demoProfile = cached ?? (await loadDemo(name));
      if (!cached) {
        setDemoCache((prev) => ({ ...prev, [name]: demoProfile }));
      }
      setProfile(demoProfile);
      setSaved(false);
      setError(null);
      setFormKey((key) => key + 1);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const handleSave = async (submitted: Profile) => {
    try {
      const result = await saveProfile(submitted);
      setStoredProfileId(result.profile_id);
      setProfile({ ...submitted, profile_id: result.profile_id });
      setSaved(true);
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <main>
      <h1>Profile</h1>
      {saved && <p role="status">Profile saved.</p>}
      {error && <p role="alert">{error}</p>}
      <ProfileForm
        key={formKey}
        initialProfile={profile}
        onSave={handleSave}
        onLoadDemo={handleLoadDemo}
      />
    </main>
  );
}
