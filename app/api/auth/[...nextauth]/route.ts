import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email read:org repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.username = profile?.login
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string
      session.user.username = token.username as string
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        try {
          // Check if user is a member of ClyCites organization
          const response = await fetch("https://api.github.com/user/memberships/orgs/ClyCites", {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
              Accept: "application/vnd.github.v3+json",
            },
          })

          if (response.ok) {
            const membership = await response.json()
            // Allow if user is a member (active or pending)
            if (membership.state === "active" || membership.state === "pending") {
              return true
            }
          }

          // If not a ClyCites member, still allow access but mark as external
          // This ensures the app is not limited to only organization users
          return true
        } catch (error) {
          console.error("Error checking organization membership:", error)
          // Allow access even if org check fails
          return true
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
