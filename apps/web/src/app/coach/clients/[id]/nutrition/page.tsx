import { formatWater } from "@training-hub/shared";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export const metadata = { title: "Client nutrition" };

export default async function ClientNutrition({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: targets } = await supabase
    .from("nutrition_targets")
    .select("calories, protein_g, carbs_g, fat_g, water_ml, notes, effective_from")
    .eq("client_id", id)
    .order("effective_from", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: meals } = await supabase
    .from("meal_logs")
    .select("id, title, calories, protein_g, logged_at")
    .eq("client_id", id)
    .order("logged_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-3 font-bold">Current targets</h2>
        {targets ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Target label="Calories" value={targets.calories} unit="kcal" />
            <Target label="Protein" value={targets.protein_g} unit="g" />
            <Target label="Carbs" value={targets.carbs_g} unit="g" />
            <Target label="Fat" value={targets.fat_g} unit="g" />
            <Target
              label="Water"
              display={
                targets.water_ml != null ? formatWater(targets.water_ml) : "—"
              }
            />
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            No targets set. Use “Set targets” above.
          </p>
        )}
        {targets?.notes && (
          <p className="mt-3 text-sm text-text-muted">{targets.notes}</p>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 font-bold">Recent meals</h2>
        {!meals || meals.length === 0 ? (
          <p className="text-sm text-text-muted">No meals logged yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {meals.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <div>
                  <p>{m.title}</p>
                  <p className="tnum text-xs text-text-muted">
                    {new Date(m.logged_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className="tnum text-text-muted">
                  {m.calories ? `${m.calories} kcal` : "—"}
                  {m.protein_g ? ` · ${m.protein_g}g P` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Target({
  label,
  value,
  unit,
  display,
}: {
  label: string;
  value?: number | null;
  unit?: string;
  // Pre-formatted display (e.g. "1.5 L") that overrides the value/unit pair.
  display?: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="tnum text-lg font-bold">
        {display ?? (
          <>
            {value ?? "—"}
            <span className="text-sm font-normal text-text-muted"> {unit}</span>
          </>
        )}
      </p>
    </div>
  );
}
