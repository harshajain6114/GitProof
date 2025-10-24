"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CommitList } from "@/components/commit-list"
import { Toast } from "@/components/toast"

export function DashboardContent() {
  const [commits, setCommits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [dataUploaded, setDataUploaded] = useState(false)

  const handleFetchCommits = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setCommits([
        { id: 1, repo: "gitproof-core", message: "feat: add blockchain verification", timestamp: "2 hours ago" },
        { id: 2, repo: "gitproof-ui", message: "fix: improve dashboard performance", timestamp: "5 hours ago" },
        { id: 3, repo: "gitproof-contracts", message: "test: add unit tests for minting", timestamp: "1 day ago" },
      ])
      setIsLoading(false)
      setToast({ message: "Commits fetched successfully", type: "success" })
    }, 1500)
  }

  const handleUploadToLighthouse = async () => {
    setIsUploading(true)
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      setDataUploaded(true)
      setToast({ message: "Data encrypted and uploaded to Lighthouse", type: "success" })
    }, 2000)
  }

  const handleMintToken = async () => {
    setIsMinting(true)
    // Simulate minting
    setTimeout(() => {
      setIsMinting(false)
      setToast({ message: "ProofToken minted successfully! 🎉", type: "success" })
    }, 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="space-y-2 mb-12">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Manage your GitHub commits and earn ProofTokens</p>
      </div>

      {/* Connection Info */}
      <Card className="bg-card/50 border-border mb-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">GitHub Username</p>
            <p className="font-mono text-lg">@octocat</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Wallet Address</p>
            <p className="font-mono text-lg">0x1234...5678</p>
          </div>
        </div>
      </Card>

      {/* Fetch Commits Section */}
      <div className="space-y-6 mb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Commits</h2>
          <Button
            onClick={handleFetchCommits}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? "Fetching..." : "Fetch My Commits"}
          </Button>
        </div>

        {commits.length > 0 && <CommitList commits={commits} />}
        {commits.length === 0 && !isLoading && (
          <Card className="bg-card/30 border-border p-8 text-center">
            <p className="text-muted-foreground">No commits fetched yet. Click "Fetch My Commits" to get started.</p>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      {commits.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleUploadToLighthouse}
            disabled={isUploading || dataUploaded}
            variant={dataUploaded ? "outline" : "default"}
            className={dataUploaded ? "bg-secondary/50" : "bg-primary hover:bg-primary/90 text-primary-foreground"}
          >
            {isUploading
              ? "Uploading..."
              : dataUploaded
                ? "✓ Uploaded to Lighthouse"
                : "Encrypt & Upload to Lighthouse"}
          </Button>
          <Button
            onClick={handleMintToken}
            disabled={!dataUploaded || isMinting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
          >
            {isMinting ? "Minting..." : "Mint ProofToken"}
          </Button>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
