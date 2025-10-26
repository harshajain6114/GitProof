
import { Button } from "@/components/ui/button"
import { MintData } from "./github-verifier-types"

interface TokenMintStatusProps {
  data: MintData
  onLoadRepos: () => void
}

export function TokenMintStatus({ data, onLoadRepos }: TokenMintStatusProps) {
  return (
    <div className="border rounded-lg p-6 bg-green-50 dark:bg-green-950/20">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Tokens Minted Successfully
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Amount:</span>
          <span className="font-bold text-green-600 dark:text-green-400">
            {data.amount}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Transaction:</span>
          <a 
            href={data.explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline text-xs"
          >
            {data.transactionHash.slice(0, 10)}... →
          </a>
        </div>
      </div>

      <Button
        onClick={onLoadRepos}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
      >
        Load My Repositories
      </Button>
    </div>
  )
}