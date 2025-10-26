"use client"

import { GithubVerifier } from "@/components/github-verifier"

export default function VerifyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center space-y-6 mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Verify Your GitHub Contributions
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect your GitHub account to start earning ProofTokens for your verified work
        </p>
      </div>
      
      <GithubVerifier />
    </div>
  )
}