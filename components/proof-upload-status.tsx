import { UploadData } from "./github-verifier-types"

interface ProofUploadStatusProps {
  data: UploadData
}

export function ProofUploadStatus({ data }: ProofUploadStatusProps) {
  return (
    <div className="border rounded-lg p-6 bg-blue-50 dark:bg-blue-950/20">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Proof Stored on Lighthouse
      </h3>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">CID:</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {data.cid.slice(0, 20)}...
          </span>
        </div>
        <a 
          href={data.ipfsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline text-xs block"
        >
          View on IPFS →
        </a>
      </div>
    </div>
  )
}
