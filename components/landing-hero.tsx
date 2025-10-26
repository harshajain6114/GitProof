"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LandingHero() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          {/* Terminal-style header */}
          <div className="inline-block">
            <div className="code-block">
              <span className="text-primary">$</span>{" "}
              <span className="text-muted-foreground">gitproof</span>{" "}
              <span className="text-primary">--verify</span>
            </div>
          </div>
          
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              GitProof
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground">
              Verify your GitHub Work. Earn ProofTokens.
            </p>
          </div>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect your GitHub, prove your contributions, and earn rewards for
            real data. Powered by blockchain and Lighthouse storage.
          </p>
          
          {/* CTA Button - Navigate to verify page */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/verify">
              <Button size="lg" className="text-base">
                Get Started
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="lg" variant="outline" className="text-base">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 pt-20 border-t border-border">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold">→</span>
            </div>
            <h3 className="font-semibold">Connect & Verify</h3>
            <p className="text-sm text-muted-foreground">
              Link your GitHub account and verify your commit history
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold">◆</span>
            </div>
            <h3 className="font-semibold">Encrypt & Store</h3>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted and stored on Lighthouse
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold">★</span>
            </div>
            <h3 className="font-semibold">Earn Rewards</h3>
            <p className="text-sm text-muted-foreground">
              Mint ProofTokens and join the leaderboard
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}