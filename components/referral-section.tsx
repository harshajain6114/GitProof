
import { Button } from "@/components/ui/button"

interface ReferralSectionProps {
  referralLink: string
  onCopy: () => void
  showCopied: boolean
}

export function ReferralSection({ referralLink, onCopy, showCopied }: ReferralSectionProps) {
  return (
    <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Refer & Earn 50 GIT
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Share your link. When friends verify, you both earn tokens.
        </p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="flex-1 px-3 py-2 text-xs border rounded bg-white dark:bg-gray-800 font-mono text-gray-700 dark:text-gray-300"
        />
        <Button
          onClick={onCopy}
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {showCopied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  )
}