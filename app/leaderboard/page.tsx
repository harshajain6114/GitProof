import { Navbar } from "@/components/navbar"
import { LeaderboardContent } from "@/components/leaderboard-content"

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LeaderboardContent />
    </div>
  )
}
