import type { ExerciseCategory } from "./enums";

// Maps each exercise category to its brand illustration under
// apps/web/public/brand/exercises/. The 'other' category reuses the
// stretching illustration (the 15th asset in the set).
export const categoryIllustration: Record<ExerciseCategory, string> = {
  squat: "/brand/exercises/squat.svg",
  hinge: "/brand/exercises/hinge.svg",
  lunge: "/brand/exercises/lunge.svg",
  push_horizontal: "/brand/exercises/push-horizontal.svg",
  push_vertical: "/brand/exercises/push-vertical.svg",
  pull_horizontal: "/brand/exercises/pull-horizontal.svg",
  pull_vertical: "/brand/exercises/pull-vertical.svg",
  carry: "/brand/exercises/carry.svg",
  core: "/brand/exercises/core.svg",
  cardio: "/brand/exercises/cardio.svg",
  mobility: "/brand/exercises/mobility.svg",
  plyometric: "/brand/exercises/plyometric.svg",
  olympic: "/brand/exercises/olympic.svg",
  isolation: "/brand/exercises/isolation.svg",
  other: "/brand/exercises/stretching.svg",
};

export const categoryLabel: Record<ExerciseCategory, string> = {
  squat: "Squat",
  hinge: "Hinge",
  lunge: "Lunge",
  push_horizontal: "Horizontal Push",
  push_vertical: "Vertical Push",
  pull_horizontal: "Horizontal Pull",
  pull_vertical: "Vertical Pull",
  carry: "Carry",
  core: "Core",
  cardio: "Cardio",
  mobility: "Mobility",
  plyometric: "Plyometric",
  olympic: "Olympic",
  isolation: "Isolation",
  other: "Other",
};
