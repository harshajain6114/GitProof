"use client"
import Link from "next/link"
import Image from "next/image"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export function Navbar() {
  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="GitProof" 
              width={32} 
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-lg hidden sm:inline">GitProof</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/leaderboard" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Leaderboard
            </Link>
            <Link 
              href="/feed" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Feed
            </Link>
          </div>

          {/* Connect Wallet */}
          <div className="flex items-center">
            <div className="[&_button]:bg-primary [&_button]:hover:bg-primary/90 [&_button]:text-primary-foreground [&_button]:font-semibold [&_button]:px-4 [&_button]:py-2 [&_button]:rounded-lg [&_button]:transition-colors">
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
      </div>
    </nav>
  )
}