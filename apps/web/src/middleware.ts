import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Session refresh + role routing. Role is read from the profiles table
// (immutable after signup) rather than user-mutable auth metadata; RLS
// remains the actual data guard.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Carry any refreshed-session cookies from `response` onto a redirect, so
  // rotated refresh tokens actually reach the browser.
  const redirectTo = (pathname: string, search?: string) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = search ?? "";
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };

  const path = request.nextUrl.pathname;
  const wantsCoach = path === "/coach" || path.startsWith("/coach/");
  const wantsApp = path === "/app" || path.startsWith("/app/");

  if (!user && (wantsCoach || wantsApp)) {
    return redirectTo("/auth/sign-in", `?next=${encodeURIComponent(path)}`);
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = profile?.role === "trainer" ? "trainer" : "client";

    if (wantsCoach && role !== "trainer") return redirectTo("/app");
    if (wantsApp && role !== "client") return redirectTo("/coach");
    if (path.startsWith("/auth/") && !path.startsWith("/auth/invite/")) {
      return redirectTo(role === "trainer" ? "/coach" : "/app");
    }
  }

  return response;
}

export const config = {
  // /auth/callback is excluded — it must run its code exchange, not be
  // bounced by the signed-in redirect.
  matcher: [
    "/coach/:path*",
    "/app/:path*",
    "/auth/sign-in",
    "/auth/sign-up",
    "/coach",
    "/app",
  ],
};
