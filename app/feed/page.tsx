import { Navbar } from "@/components/navbar"
import { FeedContent } from "@/components/feed-content"

export default function Feed() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FeedContent />
    </div>
  )
}
