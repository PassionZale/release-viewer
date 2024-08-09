import { NextRequest, NextResponse } from "next/server";
import { COOKIE_JWT_KEY } from "@/types/constant";
import { getVerifiedToken } from "@/libs/guards";

const AUTH_PAGES = ["/login"];

const isAuthPages = (url: string) =>
  AUTH_PAGES.some((path) => path.startsWith(url));

export async function middleware(request: NextRequest) {
  const { url, nextUrl } = request;

  const hasVerifiedToken = await getVerifiedToken();

  const isAuthPageRequested = isAuthPages(nextUrl.pathname);

  if (isAuthPageRequested) {
    if (!hasVerifiedToken) {
      const response = NextResponse.next();
      response.cookies.delete(COOKIE_JWT_KEY);
      return response;
    }

    const response = NextResponse.redirect(new URL(`/dashboard`, url));
    return response;
  }

  if (!hasVerifiedToken) {
    const searchParams = new URLSearchParams(nextUrl.searchParams);
    searchParams.set("next", nextUrl.pathname);

    const response = NextResponse.redirect(
      new URL(`/login?${searchParams}`, url)
    );
    response.cookies.delete(COOKIE_JWT_KEY);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
