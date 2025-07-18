import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/AuthProvider"
import { Header } from "@/components/Header"
import { BreadcrumbNav } from "@/components/BreadcrumbNav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GitHub Issues Dashboard",
  description: "Professional GitHub Issues Dashboard with OAuth authentication",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <BreadcrumbNav />
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
