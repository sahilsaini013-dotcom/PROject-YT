"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  categoryIllustration,
  categoryLabel,
  type ExerciseCategory,
} from "@training-hub/shared";
import { Card, Input } from "@/components/ui";

type Exercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
  equipment: string | null;
  instructions: string | null;
};

const categories = Object.keys(categoryLabel) as ExerciseCategory[];

export function ExerciseLibrary({ exercises }: { exercises: Exercise[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ExerciseCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((ex) => {
      if (category !== "all" && ex.category !== category) return false;
      if (!q) return true;
      return (
        ex.name.toLowerCase().includes(q) ||
        ex.equipment?.toLowerCase().includes(q)
      );
    });
  }, [exercises, query, category]);

  return (
    <div className="space-y-6">
      <Input
        type="search"
        placeholder="Search exercises or equipment…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search exercises"
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={category === "all"}
          onClick={() => setCategory("all")}
        >
          All
        </FilterChip>
        {categories.map((c) => (
          <FilterChip
            key={c}
            active={category === c}
            onClick={() => setCategory(c)}
          >
            {categoryLabel[c]}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-text-muted">
          No exercises match your search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => (
            <Card key={ex.id} className="flex gap-4">
              <Image
                src={categoryIllustration[ex.category]}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-(--radius-control) bg-surface-raised"
              />
              <div className="min-w-0">
                <h3 className="truncate font-semibold">{ex.name}</h3>
                <p className="text-xs uppercase tracking-wide text-text-muted">
                  {categoryLabel[ex.category]}
                  {ex.equipment ? ` · ${ex.equipment}` : ""}
                </p>
                {ex.instructions && (
                  <p className="mt-1 line-clamp-2 text-sm text-text-muted">
                    {ex.instructions}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        active
          ? "border-accent bg-accent text-ink"
          : "border-border text-text-muted hover:border-text-muted hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
