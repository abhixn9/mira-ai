import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Check if Clerk publishable key is defined and is not a mock key
const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('dummy');

let middlewareHandler;

if (hasClerkKey) {
  const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/builder(.*)",
    "/ats-checker(.*)",
    "/parser(.*)",
    "/cover-letter(.*)",
    "/admin(.*)"
  ]);

  middlewareHandler = clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  });
} else {
  // Dummy middleware fallback for local sandbox mode
  middlewareHandler = () => {
    return NextResponse.next();
  };
}

export default middlewareHandler;

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    '/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
