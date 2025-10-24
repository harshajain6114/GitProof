"use client"

import { Card } from "@/components/ui/card"

interface LeaderboardEntry {
  rank: number
  username: string
  commits: number
  tokens: number
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "octocat", commits: 1250, tokens: 5000 },
  { rank: 2, username: "torvalds", commits: 980, tokens: 3920 },
  { rank: 3, username: "gvanrossum", commits: 850, tokens: 3400 },
  { rank: 4, username: "dhh", commits: 720, tokens: 2880 },
  { rank: 5, username: "mojombo", commits: 650, tokens: 2600 },
  { rank: 6, username: "schacon", commits: 580, tokens: 2320 },
  { rank: 7, username: "wycats", commits: 520, tokens: 2080 },
  { rank: 8, username: "tenderlove", commits: 480, tokens: 1920 },
]

export function LeaderboardContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="space-y-2 mb-12">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">Top contributors by commits and ProofTokens earned</p>
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-3">
        {mockLeaderboard.map((entry) => (
          <Card key={entry.rank} className="bg-card/50 border-border p-4 hover:bg-card/70 transition">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                  {entry.rank}
                </div>
                <div>
                  <p className="font-semibold">@{entry.username}</p>
                  <p className="text-xs text-muted-foreground">{entry.commits} commits verified</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold text-primary">{entry.tokens.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">ProofTokens</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
