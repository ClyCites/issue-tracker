"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserNav } from "./UserNav"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Github, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "All Issues", href: "/issues" },
  { name: "My Issues", href: "/issues/assigned" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Github className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold tracking-tight">GitHub Issues</span>
                <span className="hidden md:inline text-lg font-bold tracking-tight text-muted-foreground ml-1">
                  Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop User Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <UserNav />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <UserNav />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <Github className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold">GitHub Issues Dashboard</span>
                  </div>
                </div>

                <nav className="flex flex-col space-y-2 mt-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t">
                  <div className="text-sm text-muted-foreground mb-4">Quick Actions</div>
                  <div className="space-y-2">
                    <Link
                      href="/issues?state=open"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Open Issues
                    </Link>
                    <Link
                      href="/issues?state=closed"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Closed Issues
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar (Alternative approach - uncomment if preferred) */}
      {/* 
      <div className="md:hidden border-t bg-background/95">
        <nav className="container mx-auto px-4 py-2">
          <div className="flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex-1 px-3 py-2 rounded-md text-center text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      */}
    </header>
  )
}
