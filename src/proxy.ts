import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
    "/login",
    "/register",
    "/register-success",
];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublicRoute = publicRoutes.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`)
    );

    if (isPublicRoute) {
        return NextResponse.next();
    }

    const session = request.cookies.get("session")?.value;

    if (!session) {
        const loginUrl = new URL("/login", request.url);

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images|brands).*)",
    ],
};