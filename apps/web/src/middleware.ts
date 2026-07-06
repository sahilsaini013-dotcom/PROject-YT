import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Session refresh + role routing. user_metadata.role decides where a user
// belongs; RLS remains the actual data guard.
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

  const path = request.nextUrl.pathname;
  const wantsCoach = path === "/coach" || path.startsWith("/coach/");
  const wantsApp = path === "/app" || path.startsWith("/app/");

  if (!user && (wantsCoach || wantsApp)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user) {
    const role = user.user_metadata?.role === "trainer" ? "trainer" : "client";
    if (wantsCoach && role !== "trainer") {
      return NextResponse.redirect(new URL("/app", request.url));
    }
    if (wantsApp && role !== "client") {
      return NextResponse.redirect(new URL("/coach", request.url));
    }
    if (path.startsWith("/auth/") && !path.startsWith("/auth/invite/")) {
      return NextResponse.redirect(
        new URL(role === "trainer" ? "/coach" : "/app", request.url),
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/coach/:path*", "/app/:path*", "/auth/:path*", "/coach", "/app"],
};
