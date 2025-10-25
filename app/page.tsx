import { Navbar } from "@/components/navbar"
import { LandingHero } from "@/components/landing-hero"
import { LandingFooter } from "@/components/landing-footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
     
      <LandingHero />
      <LandingFooter />
    </div>
  )
}
