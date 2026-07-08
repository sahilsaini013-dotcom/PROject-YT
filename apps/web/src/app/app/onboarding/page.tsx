"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  cmToFtIn,
  ftInToCm,
  kgToLb,
  lbToKg,
  type UnitPreference,
} from "@training-hub/shared";
import { createClient } from "@/lib/supabase/client";
import {
  Button,
  Card,
  ErrorText,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui";

export default function OnboardingPage() {
  const router = useRouter();
  const [unitPreference, setUnitPreference] =
    useState<UnitPreference>("metric");
  const [goal, setGoal] = useState("");
  // Height/weight are held in the currently-selected display units and only
  // converted to metric (the DB canonical) on save.
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState(""); // kg when metric, lb when imperial
  const [experience, setExperience] = useState<
    "beginner" | "intermediate" | "advanced" | "athlete"
  >("beginner");
  const [injuries, setInjuries] = useState("");
  const [scheduleNotes, setScheduleNotes] = useState("");
  const [equipmentNotes, setEquipmentNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Convert entered values in place when the unit toggle flips, so a partly
  // filled form is not silently reinterpreted.
  function switchUnits(next: UnitPreference) {
    if (next === unitPreference) return;
    if (next === "imperial") {
      if (heightCm) {
        const { ft, inches } = cmToFtIn(Number(heightCm));
        setHeightFt(String(ft));
        setHeightIn(String(inches));
      }
      if (weight) setWeight(String(Math.round(kgToLb(Number(weight)))));
    } else {
      if (heightFt || heightIn) {
        setHeightCm(
          String(Math.round(ftInToCm(Number(heightFt || 0), Number(heightIn || 0)))),
        );
      }
      if (weight) setWeight((lbToKg(Number(weight))).toFixed(1));
    }
    setUnitPreference(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      setError("Your session expired — sign in again.");
      return;
    }

    const height_cm =
      unitPreference === "imperial"
        ? heightFt || heightIn
          ? Math.round(ftInToCm(Number(heightFt || 0), Number(heightIn || 0)))
          : null
        : heightCm
          ? Number(heightCm)
          : null;
    const weight_kg = weight
      ? unitPreference === "imperial"
        ? Number(lbToKg(Number(weight)).toFixed(1))
        : Number(weight)
      : null;

    const { error: upsertError } = await supabase.from("client_profiles").upsert({
      id: user.id,
      goal: goal || null,
      height_cm,
      weight_kg,
      experience_level: experience,
      injuries: injuries || null,
      schedule_notes: scheduleNotes || null,
      equipment_notes: equipmentNotes || null,
      unit_preference: unitPreference,
    });
    setBusy(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    router.push("/app");
    router.refresh();
  }

  const imperial = unitPreference === "imperial";

  return (
    <main className="min-h-screen bg-ink px-6 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="mb-1 text-2xl font-bold">Set up your profile</h1>
        <p className="mb-6 text-sm text-text-muted">
          Train solo or with a coach — this tailors your plan and units.
        </p>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="units">Units</Label>
              <div
                role="group"
                aria-label="Units"
                className="grid grid-cols-2 gap-2"
              >
                <button
                  type="button"
                  onClick={() => switchUnits("metric")}
                  aria-pressed={!imperial}
                  className={`rounded-(--radius-control) border px-3 py-2 text-sm font-medium transition-colors ${
                    !imperial
                      ? "border-accent bg-accent text-ink"
                      : "border-border bg-surface text-text-muted hover:text-text"
                  }`}
                >
                  Metric (kg, cm)
                </button>
                <button
                  type="button"
                  onClick={() => switchUnits("imperial")}
                  aria-pressed={imperial}
                  className={`rounded-(--radius-control) border px-3 py-2 text-sm font-medium transition-colors ${
                    imperial
                      ? "border-accent bg-accent text-ink"
                      : "border-border bg-surface text-text-muted hover:text-text"
                  }`}
                >
                  Imperial (lb, ft/in)
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="goal">What&apos;s your main goal?</Label>
              <Textarea
                id="goal"
                rows={2}
                required
                placeholder="Build muscle, lose fat, first pull-up…"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
            {imperial ? (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="height-ft">Height (ft)</Label>
                  <Input
                    id="height-ft"
                    type="number"
                    inputMode="numeric"
                    min={3}
                    max={8}
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="height-in">Height (in)</Label>
                  <Input
                    id="height-in"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={11}
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (lb)</Label>
                  <Input
                    id="weight"
                    type="number"
                    inputMode="decimal"
                    min={65}
                    max={660}
                    step="1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    inputMode="decimal"
                    min={100}
                    max={250}
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    inputMode="decimal"
                    min={30}
                    max={300}
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="experience">Training experience</Label>
              <Select
                id="experience"
                value={experience}
                onChange={(e) =>
                  setExperience(
                    e.target.value as
                      | "beginner"
                      | "intermediate"
                      | "advanced"
                      | "athlete",
                  )
                }
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="athlete">Athlete</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="injuries">Injuries or limitations</Label>
              <Textarea
                id="injuries"
                rows={2}
                placeholder="Anything to train around"
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="schedule">When can you train?</Label>
              <Input
                id="schedule"
                placeholder="e.g. Mon/Wed/Fri mornings"
                value={scheduleNotes}
                onChange={(e) => setScheduleNotes(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="equipment">Equipment access</Label>
              <Input
                id="equipment"
                placeholder="Commercial gym, home rack, bands only…"
                value={equipmentNotes}
                onChange={(e) => setEquipmentNotes(e.target.value)}
              />
            </div>
            <ErrorText>{error}</ErrorText>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Saving…" : "Start training"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
