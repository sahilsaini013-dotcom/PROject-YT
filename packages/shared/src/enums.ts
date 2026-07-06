import { z } from "zod";

// Mirrors the Postgres enum types in Brain/10-database-schema.md.
// Any change here must ship with a matching migration.

export const userRole = z.enum(["trainer", "client"]);
export type UserRole = z.infer<typeof userRole>;

export const relationshipStatus = z.enum(["invited", "active", "paused", "ended"]);
export type RelationshipStatus = z.infer<typeof relationshipStatus>;

export const invitationStatus = z.enum(["pending", "accepted", "expired", "revoked"]);
export type InvitationStatus = z.infer<typeof invitationStatus>;

export const experienceLevel = z.enum(["beginner", "intermediate", "advanced", "athlete"]);
export type ExperienceLevel = z.infer<typeof experienceLevel>;

export const exerciseCategory = z.enum([
  "squat",
  "hinge",
  "lunge",
  "push_horizontal",
  "push_vertical",
  "pull_horizontal",
  "pull_vertical",
  "carry",
  "core",
  "cardio",
  "mobility",
  "plyometric",
  "olympic",
  "isolation",
  "other",
]);
export type ExerciseCategory = z.infer<typeof exerciseCategory>;

export const mediaKind = z.enum(["image", "video"]);
export type MediaKind = z.infer<typeof mediaKind>;

export const assignmentStatus = z.enum(["active", "completed", "cancelled"]);
export type AssignmentStatus = z.infer<typeof assignmentStatus>;

export const sessionStatus = z.enum(["pending", "in_progress", "completed", "skipped"]);
export type SessionStatus = z.infer<typeof sessionStatus>;

export const prKind = z.enum(["weight", "reps", "volume", "e1rm"]);
export type PrKind = z.infer<typeof prKind>;

export const photoPose = z.enum(["front", "side", "back", "other"]);
export type PhotoPose = z.infer<typeof photoPose>;

export const notificationKind = z.enum([
  "workout_assigned",
  "workout_reminder",
  "checkin_missed",
  "nutrition_reminder",
  "message_received",
  "session_reminder",
  "nudge_approved",
  "pr_achieved",
  "system",
]);
export type NotificationKind = z.infer<typeof notificationKind>;

export const aiRecKind = z.enum([
  "push_harder",
  "maintain",
  "reduce_volume",
  "deload",
  "nutrition_adherence",
  "increase_protein",
  "increase_calories",
  "emotional_check_in",
  "review_technique",
  "change_exercise",
  "celebrate_progress",
  "escalate",
]);
export type AiRecKind = z.infer<typeof aiRecKind>;

export const aiRecStatus = z.enum(["pending", "approved", "edited", "dismissed"]);
export type AiRecStatus = z.infer<typeof aiRecStatus>;
