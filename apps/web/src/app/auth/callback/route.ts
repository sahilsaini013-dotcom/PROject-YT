import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { homePathForRole } from "@/lib/auth";

// Exchanges the PKCE code from a magic link / email confirmation for a
// session, then routes the user to their role home.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user!.id)
        .single();
      const dest =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next
          : homePathForRole(profile?.role);
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/sign-in?error=auth`);
}
