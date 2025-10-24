"use client"

import Link from "next/link"
import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export function Navbar() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-mono text-sm">
              GP
            </div>
            <span className="hidden sm:inline">GitProof</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition">
              Dashboard
            </Link>
            <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition">
              Leaderboard
            </Link>
            <Link href="/feed" className="text-sm text-muted-foreground hover:text-foreground transition">
              Feed
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
      <ConnectButton
        showBalance={false}
        accountStatus={{
          smallScreen: "avatar",
          largeScreen: "full",
        }}
        chainStatus="icon"
      />
    </div>
        </div>
      </div>
    </nav>
  )
}
