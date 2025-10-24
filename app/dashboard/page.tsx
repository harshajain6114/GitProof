import { Navbar } from "@/components/navbar"
import { DashboardContent } from "@/components/dashboard-content"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardContent />
    </div>
  )
}
