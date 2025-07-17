"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogIn, LogOut, User, Github, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"

export function UserNav() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
      </div>
    )
  }

  if (!session) {
    return (
      <Button onClick={() => signIn("github")} variant="outline" size="sm" className="text-sm">
        <LogIn className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Sign In</span>
        <span className="sm:hidden">Sign In</span>
      </Button>
    )
  }

  const username = (session.user as any)?.username

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-accent">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user?.image || "/placeholder.svg"} alt={session.user?.name || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user?.image || "/placeholder.svg"} alt={session.user?.name || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  <User className="w-3 h-3" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                {username && <p className="text-xs leading-none text-muted-foreground">@{username}</p>}
              </div>
            </div>
            {session.user?.email && (
              <p className="text-xs leading-none text-muted-foreground truncate">{session.user.email}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/issues/assigned" className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            My Assigned Issues
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/issues" className="cursor-pointer">
            <Github className="w-4 h-4 mr-2" />
            All Issues
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <Settings className="w-4 h-4 mr-2" />
          Settings
          <span className="ml-auto text-xs text-muted-foreground">Soon</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <HelpCircle className="w-4 h-4 mr-2" />
          Help & Support
          <span className="ml-auto text-xs text-muted-foreground">Soon</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600 cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
