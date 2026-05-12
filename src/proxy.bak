import { default as nextAuthMiddleware } from "next-auth/middleware";

export default function proxy(req: any, event: any) {
  return nextAuthMiddleware(req, event);
}

export const config = {
  matcher: ["/admin/:path*"]
};
