import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Web3Provider } from "@/providers/wallet-provider"
import { Navbar } from "@/components/navbar"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GitProof — Verify Your GitHub Work",
  description: "Connect your GitHub, prove your contributions, and earn rewards for real data.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} antialiased bg-background text-foreground`}>
        <Web3Provider>
          {/* <Navbar /> */}
          {children}
          <Analytics />
        </Web3Provider>
      </body>
    </html>
  )
}