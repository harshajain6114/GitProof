
import { Button } from "@/components/ui/button"
import { ReclaimProof } from "./github-verifier-types"

interface MintingFormProps {
  proof: ReclaimProof
  username: string
  timestamp: string
  onMint: () => void
  uploading: boolean
  minting: boolean
}

export function MintingForm({
  proof,
  username,
  timestamp,
  onMint,
  uploading,
  minting
}: MintingFormProps) {
  return (
    <div className="border rounded-lg p-6 bg-green-50 dark:bg-green-950/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
          ✓
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          GitHub Verified
        </h3>
      </div>
      
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Username:</span>
          <span className="font-mono font-medium text-gray-900 dark:text-gray-100">
            {username}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Verified:</span>
          <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
            {timestamp}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Proof ID:</span>
          <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
            {proof.identifier.slice(0, 20)}...
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-green-200 dark:border-green-800">
        <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Step 2: Mint DataCoin & Earn Rewards
        </h4>
        <Button
          onClick={onMint}
          disabled={uploading || minting}
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {uploading && "Uploading to Lighthouse..."}
          {minting && "Minting Tokens..."}
          {!uploading && !minting && "Mint DataCoin & Earn 10 GIT"}
        </Button>
      </div>
    </div>
  )
}
