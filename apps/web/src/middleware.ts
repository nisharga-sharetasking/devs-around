import type { NextRequest } from "next/server";
import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT } from "./auth/routes";
// import { getDecodedUser } from "./auth/decoded";

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const accessToken = request.cookies.get("accessToken")?.value;
  // const decodedUser = getDecodedUser(accessToken as string);

  // check if the route is auth route or not
  // const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.some((route) => {
    // Allow all "/posts/*"
    if (route === "/posts" && nextUrl.pathname.startsWith("/posts")) return true;
    return nextUrl.pathname === route;
  });

  // if the route is auth route (like: '/' or '/register' etc), and user is logged in then redirect to 'DEFAULT_LOGIN_REDIRECT' route. otherwise allow the user to access this route.
  if (isAuthRoute) {
    if (accessToken) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }


  // if the user is not loggedin and route is not a auth route then redirect to '/' page
  if (!accessToken && !isAuthRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // if user hit '/dashboard' route than redirect to the '/dashboard/overview' route
  if (nextUrl.pathname === "/dashboard") {
    return Response.redirect(new URL("/dashboard/overview", nextUrl));
  }

  // this return means default doing nothing
  return;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
