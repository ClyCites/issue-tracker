import { type NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session || !(session as any).accessToken) {
      return NextResponse.json({ isMember: false, error: "No access token" })
    }

    const response = await fetch("https://api.github.com/user/memberships/orgs/ClyCites", {
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (response.ok) {
      const membership = await response.json()
      return NextResponse.json({
        isMember: membership.state === "active" || membership.state === "pending",
        state: membership.state,
      })
    }

    return NextResponse.json({ isMember: false })
  } catch (error) {
    console.error("Error checking organization membership:", error)
    return NextResponse.json({ isMember: false, error: "Failed to check membership" })
  }
}
