import { Card } from "@/components/ui/card"

interface Commit {
  id: number
  repo: string
  message: string
  timestamp: string
}

export function CommitList({ commits }: { commits: Commit[] }) {
  return (
    <div className="space-y-3">
      {commits.map((commit) => (
        <Card key={commit.id} className="bg-card/50 border-border p-4 hover:bg-card/70 transition">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm text-primary mb-1">{commit.repo}</p>
              <p className="text-foreground truncate">{commit.message}</p>
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap">{commit.timestamp}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
