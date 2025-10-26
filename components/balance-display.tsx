
interface BalanceDisplayProps {
  balance: number
}

export function BalanceDisplay({ balance }: BalanceDisplayProps) {
  if (balance === 0) return null

  const canDecrypt = balance >= 100
  const progressPercentage = Math.min((balance / 100) * 100, 100)

  return (
    <div className="border rounded-lg p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Token Balance
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {canDecrypt 
              ? 'Decryption unlocked' 
              : `${100 - balance} GIT needed to decrypt`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {balance} GIT
          </p>
          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div 
              className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}