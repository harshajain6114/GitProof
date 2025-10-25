"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GithubVerifier } from "@/components/github-verifier"
import { Lock, Database, Gift, Users, Shield, Zap, HelpCircle, ArrowRight, Coins, Github as GithubIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function LandingHero() {
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          {/* Terminal-style header */}
          <div className="inline-block">
            <div className="code-block">
              <span className="text-primary">$</span> <span className="text-muted-foreground">gitproof</span>{" "}
              <span className="text-primary">--verify</span>
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              GitProof
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground">
              Your Code, Your Proof. Forever Stored.
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Backup your GitHub repositories to <strong>decentralized storage</strong>, earn <strong>GIT tokens</strong> for every backup, 
            and prove your contributions are real. Powered by blockchain and Lighthouse storage.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <GithubIcon className="w-4 h-4 text-primary" />
              <span>GitHub Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary" />
              <span>Earn Real Tokens</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <GithubVerifier />
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 font-semibold hover:bg-secondary/50"
              onClick={() => setShowHowItWorks(true)}
            >
              <HelpCircle className="mr-2 w-4 h-4" />
              How It Works
            </Button>
          </div>

          {/* Token economics preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="text-2xl font-bold text-primary">10 GIT</div>
              <div className="text-xs text-muted-foreground">Verify GitHub</div>
            </div>
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="text-2xl font-bold text-primary">30 GIT</div>
              <div className="text-xs text-muted-foreground">Per Backup</div>
            </div>
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="text-2xl font-bold text-primary">50 GIT</div>
              <div className="text-xs text-muted-foreground">Per Referral</div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 pt-20 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">247</div>
              <div className="text-sm text-muted-foreground">Repos Backed Up</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">12,450</div>
              <div className="text-sm text-muted-foreground">GIT Earned</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">89+</div>
              <div className="text-sm text-muted-foreground">Developers</div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="space-y-3 p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Military-Grade Encryption</h3>
            <p className="text-sm text-muted-foreground">
              AES-256 encryption ensures only you can decrypt your backed up code
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Decentralized Storage</h3>
            <p className="text-sm text-muted-foreground">
              IPFS + Lighthouse means your data lives forever, no single point of failure
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Earn 30 GIT per Backup</h3>
            <p className="text-sm text-muted-foreground">
              Get paid in real tokens for every repository you backup and verify
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Referral Program</h3>
            <p className="text-sm text-muted-foreground">
              Invite friends and earn 50 GIT when they verify their GitHub
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Zero-Knowledge Proofs</h3>
            <p className="text-sm text-muted-foreground">
              Reclaim Protocol verifies GitHub without exposing your credentials
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Unlock at 100 GIT</h3>
            <p className="text-sm text-muted-foreground">
              Decrypt all your backed up repos once you earn 100 GIT tokens
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Modal */}
      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">How GitProof Works</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Connect & Verify GitHub</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Use Reclaim Protocol to prove you own your GitHub account. Zero-knowledge proofs ensure privacy.
                </p>
                <Badge variant="secondary">Earn: 10 GIT</Badge>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Select Repository to Backup</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Choose any repo. We download it, encrypt with AES-256, and upload to Lighthouse IPFS.
                </p>
                <Badge variant="secondary">Earn: 30 GIT per repo</Badge>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Earn GIT Tokens</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Every action earns tokens. Backup multiple repos to accumulate faster.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge>10 GIT - Verify</Badge>
                  <Badge>30 GIT - Backup</Badge>
                  <Badge>50 GIT - Referral</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Unlock Decryption at 100 GIT</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Once you hold 100+ GIT, decrypt and download all your backed up repos.
                </p>
                <Badge variant="default">Unlock: 100 GIT Required</Badge>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                5
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Share & Earn More</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Refer friends. When they verify GitHub, you both earn 50 GIT.
                </p>
                <Badge variant="secondary">Earn: 50 GIT per referral</Badge>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Why GitProof?</h3>
            <div className="grid gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">
                  <strong>Decentralized:</strong> Code stored on IPFS, not corporate servers
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">
                  <strong>Encrypted:</strong> AES-256 encryption - only you can decrypt
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">
                  <strong>Rewarding:</strong> Earn real tokens for contributing data
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">
                  <strong>Permanent:</strong> IPFS ensures code exists forever
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}