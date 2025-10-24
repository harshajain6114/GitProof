"use client"

import { Card } from "@/components/ui/card"

interface FeedEntry {
  id: number
  username: string
  repo: string
  date: string
  cid: string
}

const mockFeed: FeedEntry[] = [
  { id: 1, username: "octocat", repo: "gitproof-core", date: "2 hours ago", cid: "QmX7...3kL9" },
  { id: 2, username: "torvalds", repo: "linux-kernel", date: "5 hours ago", cid: "QmY2...8mP4" },
  { id: 3, username: "gvanrossum", repo: "cpython", date: "1 day ago", cid: "QmZ5...1nQ7" },
  { id: 4, username: "dhh", repo: "rails", date: "2 days ago", cid: "QmA9...6oR2" },
  { id: 5, username: "mojombo", repo: "github", date: "3 days ago", cid: "QmB3...4pS5" },
]

export function FeedContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="space-y-2 mb-12">
        <h1 className="text-3xl font-bold">Public Feed</h1>
        <p className="text-muted-foreground">All verified GitHub commit datasets uploaded to Lighthouse</p>
      </div>

      {/* Feed List */}
      <div className="space-y-3">
        {mockFeed.map((entry) => (
          <Card key={entry.id} className="bg-card/50 border-border p-4 hover:bg-card/70 transition cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold">@{entry.username}</p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
                <p className="font-mono text-sm text-primary mb-2">{entry.repo}</p>
                <div className="code-block">
                  <span className="text-muted-foreground">CID: </span>
                  <span className="text-foreground">{entry.cid}</span>
                </div>
              </div>
              <button className="px-3 py-1 rounded bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30 transition whitespace-nowrap">
                View
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
