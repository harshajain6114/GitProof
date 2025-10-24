import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="text-sm text-muted-foreground">© 2025 GitProof. Verify your work.</div>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">
              Docs
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">
              GitHub Repo
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">
              1MB.io
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">
              Lighthouse
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
