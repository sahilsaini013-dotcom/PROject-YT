import type { UserRole } from "@training-hub/shared";

// Single source of truth for "where does this role live" and the signup
// metadata contract with the handle_new_user() DB trigger (Brain/10).

export function homePathForRole(role: string | null | undefined): string {
  return role === "trainer" ? "/coach" : "/app";
}

export function signUpMetadata(role: UserRole, fullName: string) {
  return {
    role,
    full_name: fullName,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
