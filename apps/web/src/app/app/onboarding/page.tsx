"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [goal, setGoal] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [experience, setExperience] = useState<
    "beginner" | "intermediate" | "advanced" | "athlete"
  >("beginner");
  const [injuries, setInjuries] = useState("");
  const [scheduleNotes, setScheduleNotes] = useState("");
  const [equipmentNotes, setEquipmentNotes] = useState("");
  const [unitPreference, setUnitPreference] = useState("metric");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

    const { error: upsertError } = await supabase.from("client_profiles").upsert({
      id: user.id,
      goal: goal || null,
      height_cm: heightCm ? Number(heightCm) : null,
      weight_kg: weightKg ? Number(weightKg) : null,
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

  return (
    <main className="min-h-screen bg-ink px-6 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="mb-1 text-2xl font-bold">Set up your profile</h1>
        <p className="mb-6 text-sm text-text-muted">
          Your coach uses this to build the right plan for you.
        </p>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                />
              </div>
            </div>
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
                placeholder="Anything your coach should train around"
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
            <div>
              <Label htmlFor="units">Units</Label>
              <Select
                id="units"
                value={unitPreference}
                onChange={(e) => setUnitPreference(e.target.value)}
              >
                <option value="metric">Metric (kg, cm)</option>
                <option value="imperial">Imperial (lb, in)</option>
              </Select>
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
