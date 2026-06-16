import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = (token as any)?.role;

    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    if (pathname.startsWith("/admin/login")) {
      if (token) {
        if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (pathname.startsWith("/admin")) {
      if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));
      if (role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/profile")) {
      if (!token) return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/profile")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
