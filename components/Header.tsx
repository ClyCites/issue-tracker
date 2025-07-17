import Link from "next/link"
import { UserNav } from "./UserNav"
import { Github } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Github className="h-6 w-6" />
            <span className="font-bold">GitHub Issues Dashboard</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <Link href="/issues" className="text-sm font-medium transition-colors hover:text-primary">
              All Issues
            </Link>
            <Link href="/issues/assigned" className="text-sm font-medium transition-colors hover:text-primary">
              My Issues
            </Link>
          </nav>
          <UserNav />
        </div>
      </div>
    </header>
  )
}
