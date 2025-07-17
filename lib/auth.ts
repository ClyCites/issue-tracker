import { getServerSession } from "next-auth/next"
import GitHubProvider from "next-auth/providers/github"

export const authOptions = {
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
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token
        token.username = profile?.login
      }
      return token
    },
    async session({ session, token }: any) {
      ;(session as any).accessToken = token.accessToken as string
      if (session.user) {
        ;(session.user as any).username = token.username as string
      }
      return session
    },
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "github") {
        try {
          const response = await fetch("https://api.github.com/user/memberships/orgs/ClyCites", {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
              Accept: "application/vnd.github.v3+json",
            },
          })

          if (response.ok) {
            const membership = await response.json()
            if (membership.state === "active" || membership.state === "pending") {
              return true
            }
          }

          return true
        } catch (error) {
          console.error("Error checking organization membership:", error)
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
    strategy: "jwt" as const,
  },
}

export async function getAuthSession() {
  return await getServerSession(authOptions)
}

export async function checkOrganizationMembership(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.github.com/user/memberships/orgs/ClyCites", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (response.ok) {
      const membership = await response.json()
      return membership.state === "active" || membership.state === "pending"
    }
    return false
  } catch (error) {
    console.error("Error checking organization membership:", error)
    return false
  }
}
