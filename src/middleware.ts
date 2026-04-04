import createMiddleware from "next-intl/middleware"

import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  /* Exclude API, _next, _vercel, studio and all files with a dot */
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
}
