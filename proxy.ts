import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	const isLoginRoute = request.nextUrl.pathname === "/login";

	if (!token && !isLoginRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (token && isLoginRoute) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
