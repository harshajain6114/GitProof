
import { Button } from "@/components/ui/button"
import { BackupData } from "./github-verifier-types"

interface BackupConfirmationProps {
  data: BackupData
}

export function BackupConfirmation({ data }: BackupConfirmationProps) {
  const tweetText = `Just backed up my GitHub repo forever with @GitProof
+30 GIT earned
My code. My proof. My tokens.
#Web3 #Developers #GitProof`

  return (
    <div className="border rounded-lg p-6 bg-slate-50 dark:bg-slate-950/20 animate-in fade-in">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Repository Backed Up
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Repository:</span>
          <span className="font-mono font-medium text-xs text-gray-700 dark:text-gray-300">
            {data.repoFullName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Size:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {data.sizeMB} MB
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">CID:</span>
          <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
            {data.cid.slice(0, 20)}...
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
          <span className="text-gray-600 dark:text-gray-400">Reward:</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            +30 GIT
          </span>
        </div>
        <a 
          href={data.ipfsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-700 dark:text-slate-300 underline text-xs block mt-2"
        >
          View Backup on IPFS →
        </a>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          onClick={() => {
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, 
              '_blank'
            )
          }}
          size="sm"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Share on X / Twitter
        </Button>
      </div>
    </div>
  )
}
