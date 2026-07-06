import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export const metadata = { title: "Client check-ins" };

const metrics: { key: string; label: string }[] = [
  { key: "sleep_quality", label: "Sleep" },
  { key: "soreness", label: "Soreness" },
  { key: "energy", label: "Energy" },
  { key: "mood", label: "Mood" },
  { key: "motivation", label: "Motiv." },
];

export default async function ClientCheckIns({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: checkIns } = await supabase
    .from("check_ins")
    .select(
      "checked_in_on, sleep_quality, soreness, energy, mood, motivation, stress, pain_note, comment",
    )
    .eq("client_id", id)
    .order("checked_in_on", { ascending: false })
    .limit(30);

  if (!checkIns || checkIns.length === 0) {
    return <p className="text-sm text-text-muted">No check-ins yet.</p>;
  }

  return (
    <Card className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3 font-medium">Date</th>
              {metrics.map((m) => (
                <th key={m.key} className="px-3 py-3 text-center font-medium">
                  {m.label}
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {checkIns.map((c) => (
              <tr key={c.checked_in_on} className="border-b border-border">
                <td className="tnum whitespace-nowrap px-4 py-3">
                  {new Date(`${c.checked_in_on}T00:00:00`).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" },
                  )}
                </td>
                {metrics.map((m) => (
                  <td
                    key={m.key}
                    className="tnum px-3 py-3 text-center text-text-muted"
                  >
                    {(c[m.key as keyof typeof c] as number | null) ?? "—"}
                  </td>
                ))}
                <td className="px-4 py-3 text-text-muted">
                  {c.pain_note && (
                    <span className="text-danger">⚠ {c.pain_note}</span>
                  )}
                  {c.pain_note && c.comment ? " · " : ""}
                  {c.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
