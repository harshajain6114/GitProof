
import { Button } from "@/components/ui/button"

interface VerificationFormProps {
  onVerify: () => void
  verifying: boolean
  verified: boolean
  walletConnected: boolean
}

export function VerificationForm({ 
  onVerify, 
  verifying, 
  verified, 
  walletConnected 
}: VerificationFormProps) {
  return (
    <div className="border rounded-lg p-6 bg-white dark:bg-gray-950">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Step 1: Verify GitHub Account
      </h3>
      <Button
        onClick={onVerify}
        disabled={verifying || verified || !walletConnected}
        size="lg"
        className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900"
      >
        {verifying && "Waiting for verification..."}
        {verified && "GitHub Verified"}
        {!verifying && !verified && "Connect GitHub"}
      </Button>
      
      {!walletConnected && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
          Connect your wallet first
        </p>
      )}
    </div>
  )
}