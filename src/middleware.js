import { NextResponse } from "next/server";

export function middleware(request) {
    const accessToken = request.cookies.get("access_token")?.value;
    const pathname = request.nextUrl.pathname;

    // Logged-in users should not visit auth pages
    if (accessToken && (pathname === "/auth/login" || pathname === "/auth/register")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Unauthenticated users shouldn't visit /auth/dashboard
    if (!accessToken && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};
