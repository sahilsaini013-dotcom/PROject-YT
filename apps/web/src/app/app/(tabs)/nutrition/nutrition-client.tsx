"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, ErrorText, Input, Label } from "@/components/ui";

type Targets = {
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  water_ml: number | null;
} | null;

type Meal = {
  id: string;
  title: string;
  notes: string | null;
  calories: number | null;
  protein_g: number | null;
  logged_at: string;
  photoUrl: string | null;
};

const WATER_STEP = 250;

export function NutritionClient({
  today,
  targets,
  meals,
  waterMl,
  consumed,
}: {
  today: string;
  targets: Targets;
  meals: Meal[];
  waterMl: number;
  consumed: { calories: number; protein: number };
}) {
  const router = useRouter();
  const [water, setWater] = useState(waterMl);
  const [busyWater, setBusyWater] = useState(false);

  async function adjustWater(delta: number) {
    const next = Math.max(0, water + delta);
    setWater(next);
    setBusyWater(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("water_logs").upsert(
      { client_id: user!.id, logged_on: today, total_ml: next },
      { onConflict: "client_id,logged_on" },
    );
    setBusyWater(false);
    router.refresh();
  }

  const waterTarget = targets?.water_ml ?? null;

  return (
    <div className="mt-6 space-y-6">
      {/* Targets vs consumed */}
      <Card>
        <h2 className="mb-3 font-bold">Today&apos;s targets</h2>
        {targets ? (
          <div className="grid grid-cols-2 gap-4">
            <TargetStat
              label="Calories"
              value={consumed.calories}
              target={targets.calories}
              unit="kcal"
            />
            <TargetStat
              label="Protein"
              value={consumed.protein}
              target={targets.protein_g}
              unit="g"
            />
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            Your coach hasn&apos;t set nutrition targets yet.
          </p>
        )}
      </Card>

      {/* Water */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Water</h2>
          <span className="tnum text-sm text-text-muted">
            {water} ml{waterTarget ? ` / ${waterTarget} ml` : ""}
          </span>
        </div>
        {waterTarget && (
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-surface-raised">
            <div
              className="h-full bg-info transition-all"
              style={{
                width: `${Math.min(100, (water / waterTarget) * 100)}%`,
              }}
            />
          </div>
        )}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => adjustWater(-WATER_STEP)}
            disabled={busyWater || water === 0}
            className="flex-1"
          >
            −{WATER_STEP} ml
          </Button>
          <Button
            onClick={() => adjustWater(WATER_STEP)}
            disabled={busyWater}
            className="flex-1"
          >
            +{WATER_STEP} ml
          </Button>
        </div>
      </Card>

      {/* Meals */}
      <div>
        <h2 className="mb-3 font-bold">Meals</h2>
        <MealForm onLogged={() => router.refresh()} />
        {meals.length === 0 ? (
          <p className="mt-4 text-sm text-text-muted">
            No meals logged today yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {meals.map((m) => (
              <Card key={m.id} className="flex gap-3">
                {m.photoUrl && (
                  <Image
                    src={m.photoUrl}
                    alt=""
                    width={64}
                    height={64}
                    className="h-16 w-16 shrink-0 rounded-(--radius-control) object-cover"
                    unoptimized
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{m.title}</p>
                  {m.notes && (
                    <p className="text-sm text-text-muted">{m.notes}</p>
                  )}
                  {(m.calories || m.protein_g) && (
                    <p className="tnum mt-1 text-xs text-text-muted">
                      {m.calories ? `${m.calories} kcal` : ""}
                      {m.calories && m.protein_g ? " · " : ""}
                      {m.protein_g ? `${m.protein_g}g protein` : ""}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TargetStat({
  label,
  value,
  target,
  unit,
}: {
  label: string;
  value: number;
  target: number | null;
  unit: string;
}) {
  const pct = target ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="tnum text-lg font-bold">
        {value}
        {target ? (
          <span className="text-sm font-normal text-text-muted">
            {" "}
            / {target} {unit}
          </span>
        ) : (
          <span className="text-sm font-normal text-text-muted"> {unit}</span>
        )}
      </p>
      {target && (
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-raised">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

function MealForm({ onLogged }: { onLogged: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      setError("Please sign in again.");
      return;
    }

    const { data: meal, error: mealError } = await supabase
      .from("meal_logs")
      .insert({
        client_id: user.id,
        title,
        notes: notes || null,
        calories: calories ? Number(calories) : null,
        protein_g: protein ? Number(protein) : null,
      })
      .select("id")
      .single();
    if (mealError || !meal) {
      setBusy(false);
      setError(mealError?.message ?? "Could not save the meal.");
      return;
    }

    if (file) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const month = new Date().toISOString().slice(0, 7);
      const path = `${user.id}/${month}/${meal.id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("meal-photos")
        .upload(path, file, { upsert: true });
      if (!uploadError) {
        await supabase
          .from("meal_photos")
          .insert({ meal_log_id: meal.id, storage_path: path });
      }
    }

    setBusy(false);
    setTitle("");
    setNotes("");
    setCalories("");
    setProtein("");
    setFile(null);
    setOpen(false);
    onLogged();
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="w-full">
        Log a meal
      </Button>
    );
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <Label htmlFor="meal-title">What did you eat?</Label>
          <Input
            id="meal-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chicken and rice"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="meal-cal">Calories (optional)</Label>
            <Input
              id="meal-cal"
              type="number"
              inputMode="numeric"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="meal-protein">Protein g (optional)</Label>
            <Input
              id="meal-protein"
              type="number"
              inputMode="numeric"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="meal-notes">Notes (optional)</Label>
          <Input
            id="meal-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="meal-photo">Photo (optional)</Label>
          <input
            id="meal-photo"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-text-muted file:mr-3 file:rounded-(--radius-control) file:border-0 file:bg-surface-raised file:px-3 file:py-2 file:text-text"
          />
        </div>
        {error && <ErrorText>{error}</ErrorText>}
        <div className="flex gap-3">
          <Button type="submit" disabled={busy} className="flex-1">
            {busy ? "Saving…" : "Save meal"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
