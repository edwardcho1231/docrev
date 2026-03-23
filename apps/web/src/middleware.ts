import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/documents/:path*",
    "/api/v1/documents/:path*",
    "/api/v1/revisions/:path*",
  ],
};
