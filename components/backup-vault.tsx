
import { BackupData } from "./github-verifier-types"

interface BackupVaultProps {
  backups: BackupData[]
  balance: number
}

export function BackupVault({ backups, balance }: BackupVaultProps) {
  if (backups.length === 0) return null

  const canDecrypt = balance >= 100

  return (
    <div className="border rounded-lg p-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Proof Vault ({backups.length})
        </h3>
        {canDecrypt && (
          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-semibold">
            Decryption Unlocked
          </span>
        )}
      </div>

      <div className="grid gap-3">
        {backups.map((backup, index) => (
          <div 
            key={index} 
            className="border rounded-lg p-4 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <p className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {backup.repoFullName}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div>Size: {backup.sizeMB} MB</div>
                <div>Date: {new Date(backup.timestamp).toLocaleDateString()}</div>
                <div>AES-256 Encrypted</div>
                <div>IPFS Stored</div>
              </div>
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-[10px] font-mono text-gray-600 dark:text-gray-400 break-all">
                  CID: {backup.cid}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <a
                href={backup.ipfsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 py-2 rounded hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
              >
                View on IPFS
              </a>
              {canDecrypt ? (
                <button 
                  onClick={() => {
                    alert('Decryption feature coming soon! Download from IPFS link above.')
                  }}
                  className="flex-1 text-center text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 py-2 rounded hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors"
                >
                  Decrypt & Download
                </button>
              ) : (
                <button 
                  disabled
                  className="flex-1 text-center text-xs bg-gray-100 dark:bg-gray-800 text-gray-400 py-2 rounded cursor-not-allowed"
                >
                  Need 100 GIT
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {!canDecrypt && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-xs text-center text-yellow-800 dark:text-yellow-200">
            Backup <strong>{Math.ceil((100 - balance) / 30)} more repos</strong> to unlock decryption
          </p>
        </div>
      )}

      {canDecrypt && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-xs text-center text-green-800 dark:text-green-200">
            <strong>Congratulations!</strong> You can now decrypt all backed up repositories
          </p>
        </div>
      )}
    </div>
  )
}