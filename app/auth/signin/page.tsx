"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Shield, Users, Eye } from "lucide-react"

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    setAuthProviders()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Github className="mx-auto h-12 w-12 text-gray-900" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to GitHub Issues Dashboard</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your personalized issue dashboard and track your assignments
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Sign in with your GitHub account to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {providers &&
              Object.values(providers).map((provider: any) => (
                <Button key={provider.name} onClick={() => signIn(provider.id)} className="w-full" size="lg">
                  <Github className="w-5 h-5 mr-2" />
                  Sign in with {provider.name}
                </Button>
              ))}

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Secure OAuth authentication</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>ClyCites organization members get enhanced access</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>View and manage your assigned issues</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500">
          By signing in, you agree to our terms of service and privacy policy.
          <br />
          This application is open to all GitHub users.
        </p>
      </div>
    </div>
  )
}
