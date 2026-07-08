"use client";

import { useState } from "react";
import { categoryLabel, type ExerciseCategory } from "@training-hub/shared";
import { Input } from "@/components/ui";

export type PickableExercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
};

// Modal exercise search shared by the coach program builder and the client
// self-training screens. Filters by name, caps the list at 40, and calls
// onPick with the chosen exercise id.
export function ExercisePicker({
  exercises,
  onPick,
  onClose,
}: {
  exercises: PickableExercise[];
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const matches = exercises.filter((e) =>
    e.name.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const filtered = matches.slice(0, 40);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/70 p-4 pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-(--radius-card) border border-border bg-surface p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold">Add exercise</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-text-muted hover:text-text"
          >
            ✕
          </button>
        </div>
        <Input
          autoFocus
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search exercises"
        />
        {matches.length > filtered.length && (
          <p className="mt-2 text-xs text-text-muted">
            Showing {filtered.length} of {matches.length} — keep typing to
            narrow.
          </p>
        )}
        <ul className="mt-3 max-h-72 overflow-y-auto">
          {filtered.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => onPick(e.id)}
                className="flex w-full items-center justify-between rounded-(--radius-control) px-3 py-2 text-left transition-colors hover:bg-surface-raised"
              >
                <span>{e.name}</span>
                <span className="text-xs text-text-muted">
                  {categoryLabel[e.category]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
