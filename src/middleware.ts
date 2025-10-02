import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken");
  const { pathname } = req.nextUrl;

  if (accessToken) {
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    if (pathname === "/" || pathname.startsWith("/favorites")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}

export const config = {
  matcher: ["/", "/favorites", "/login", "/signup"],
};
