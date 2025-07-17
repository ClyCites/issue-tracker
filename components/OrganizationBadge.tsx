"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Shield, Users } from "lucide-react"

export function OrganizationBadge() {
  const { data: session } = useSession()
  const [isOrgMember, setIsOrgMember] = useState<boolean | null>(null)

  useEffect(() => {
    const checkMembership = async () => {
      if (!(session as any)?.accessToken) return

      try {
        const response = await fetch("/api/check-org-membership")
        const data = await response.json()
        setIsOrgMember(data.isMember)
      } catch (error) {
        console.error("Error checking organization membership:", error)
        setIsOrgMember(false)
      }
    }

    checkMembership()
  }, [session])

  if (!session || isOrgMember === null) return null

  return (
    <div className="flex items-center gap-2">
      {isOrgMember ? (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <Shield className="w-3 h-3 mr-1" />
          ClyCites Member
        </Badge>
      ) : (
        <Badge variant="secondary">
          <Users className="w-3 h-3 mr-1" />
          External User
        </Badge>
      )}
    </div>
  )
}
