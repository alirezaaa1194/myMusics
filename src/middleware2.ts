// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req });
//   const { pathname } = req.nextUrl;

//   if ((pathname === "/" || pathname.startsWith("/favorites")) && !token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   } else if (pathname.startsWith("/login") && token) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }
// }

// export const config = {
//   matcher: ["/", "/favorites", "/login"],
// };
