export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/issues/assigned/:path*"],
}
