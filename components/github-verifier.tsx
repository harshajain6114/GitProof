
"use client"
import { useState, useEffect } from "react"
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"

interface ReclaimProof {
  identifier: string
  claimData: {
    provider: string
    parameters: string
    owner: string
    timestampS: string
    context: string
    identifier: string
    epoch: string
  }
  signatures: string[]
  witnesses: Array<{
    id: string
    url: string
  }>
}

interface ProofContext {
  extractedParameters: {
    username?: string
    [key: string]: any
  }
}

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  size: number
  language: string
  stars: number
  updated_at: string
}

export function GithubVerifier() {
  const { address } = useAccount()
  const [verified, setVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [minting, setMinting] = useState(false)
  const [proofs, setProofs] = useState<ReclaimProof[]>([])
  const [error, setError] = useState<string | null>(null)
  const [uploadData, setUploadData] = useState<any>(null)
  const [mintData, setMintData] = useState<any>(null)
  
  // NEW: Repo backup states
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [backingUp, setBackingUp] = useState(false)
  const [backupData, setBackupData] = useState<any>(null)
  const [backupList, setBackupList] = useState<any[]>([])
  
  // NEW: Balance check
  const [balance, setBalance] = useState<number>(0)
  const [checkingBalance, setCheckingBalance] = useState(false)

  // Check balance on mount and after minting
  useEffect(() => {
    if (address) {
      checkBalance()
    }
  }, [address, mintData, backupData])

  async function checkBalance() {
    if (!address) return
    
    try {
      setCheckingBalance(true)
      const response = await fetch('/api/github/check-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      })

      if (response.ok) {
        const result = await response.json()
        setBalance(result.balance)
      }
      setCheckingBalance(false)
    } catch (err) {
      console.error('Error checking balance:', err)
      setCheckingBalance(false)
    }
  }

  async function handleVerify() {
    try {
      setVerifying(true)
      setError(null)

      const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID
      const APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET
      const PROVIDER_ID = "6d3f6753-7ee6-49ee-a545-62f1b1822ae5"

      if (!APP_ID || !APP_SECRET) {
        throw new Error("Missing Reclaim credentials")
      }

      if (!address) {
        throw new Error("Please connect your wallet first")
      }

      const reclaimProofRequest = await ReclaimProofRequest.init(
        APP_ID,
        APP_SECRET,
        PROVIDER_ID
      )

      const sessionPromise = reclaimProofRequest.startSession({
        onSuccess: (proofsData: any) => {
          console.log("✅ Proofs received:", proofsData)
          const proofsArray = Array.isArray(proofsData) ? proofsData : [proofsData]
          setProofs(proofsArray)
          setVerified(true)
          setVerifying(false)
        },
        onError: (err: any) => {
          console.error("❌ Verification failed:", err)
          setError(err instanceof Error ? err.message : "Verification failed")
          setVerifying(false)
        },
      })

      await reclaimProofRequest.triggerReclaimFlow()
      await sessionPromise
     
    } catch (err) {
      console.error("❌ Error:", err)
      setError(err instanceof Error ? err.message : "Failed to start verification")
      setVerifying(false)
    }
  }

  async function handleUploadAndMint() {
    if (!proofs.length || !address) return

    try {
      setUploading(true)
      setError(null)

      const proof = proofs[0]
      const username = getUsername(proof)

      // Step 1: Upload to Lighthouse
      console.log("📤 Uploading proof to Lighthouse...")
      const uploadResponse = await fetch('/api/verify/saveProof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proof,
          walletAddress: address,
          username
        })
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload proof')
      }

      const uploadResult = await uploadResponse.json()
      setUploadData(uploadResult.data)
      console.log("✅ Proof uploaded:", uploadResult.data)

      setUploading(false)
      setMinting(true)

      // Step 2: Mint tokens
      console.log("🪙 Minting tokens...")
      const mintResponse = await fetch('/api/datacoin/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientAddress: address,
          proofIdentifier: proof.identifier,
          amount: '10' // 10 GIT for verification
        })
      })

      if (!mintResponse.ok) {
        throw new Error('Failed to mint tokens')
      }

      const mintResult = await mintResponse.json()
      setMintData(mintResult.data)
      console.log("✅ Tokens minted:", mintResult.data)

      setMinting(false)

      // NEW: Fetch repos after minting
      await fetchUserRepos(username)

    } catch (err) {
      console.error("❌ Error:", err)
      setError(err instanceof Error ? err.message : "Failed to process")
      setUploading(false)
      setMinting(false)
    }
  }

  // NEW: Fetch user's repos
  async function fetchUserRepos(username: string) {
    try {
      setLoadingRepos(true)
      console.log("📚 Fetching repos for:", username)

      const response = await fetch('/api/github/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch repos')
      }

      const result = await response.json()
      setRepos(result.repos)
      console.log(`✅ Found ${result.total} repos`)
      setLoadingRepos(false)
    } catch (err) {
      console.error("❌ Error fetching repos:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch repos")
      setLoadingRepos(false)
    }
  }

  // NEW: Backup selected repo
  async function handleBackupRepo() {
    if (!selectedRepo || !address) return

    try {
      setBackingUp(true)
      setError(null)

      const username = getUsername(proofs[0])

      console.log("🔐 Backing up repo:", selectedRepo)

      const response = await fetch('/api/github/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoFullName: selectedRepo,
          username,
          walletAddress: address
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to backup repo')
      }

      const result = await response.json()
      
      // Add to backup list
      setBackupList(prev => [...prev, result.data])
      setBackupData(result.data)
      console.log("✅ Repo backed up:", result.data)

      // Mint backup reward (30 GIT per repo)
      await mintBackupReward()

      setBackingUp(false)
      setSelectedRepo(null)
    } catch (err) {
      console.error("❌ Error backing up repo:", err)
      setError(err instanceof Error ? err.message : "Failed to backup repo")
      setBackingUp(false)
    }
  }

  // NEW: Mint bonus tokens for backing up repo
  async function mintBackupReward() {
    try {
      console.log("🎁 Minting backup reward...")
      
      const response = await fetch('/api/datacoin/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientAddress: address,
          proofIdentifier: `backup-${Date.now()}`,
          amount: '30' // 30 GIT per backup
        })
      })

      if (response.ok) {
        console.log("✅ Backup reward minted: 30 GIT")
      }
    } catch (err) {
      console.error("❌ Error minting backup reward:", err)
    }
  }

  const getUsername = (proof: ReclaimProof): string => {
    try {
      const context: ProofContext = JSON.parse(proof.claimData.context)
      return context.extractedParameters?.username || "Unknown"
    } catch {
      return "Unknown"
    }
  }

  const formatTimestamp = (timestampS: string): string => {
    try {
      return new Date(parseInt(timestampS) * 1000).toLocaleString()
    } catch {
      return timestampS
    }
  }

  return (
    <div className="space-y-6">
      {/* NEW: Balance Display */}
      {balance > 0 && (
        <div className="border rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <div>
                <p className="text-sm font-semibold">Your Balance</p>
                <p className="text-xs text-muted-foreground">
                  {balance >= 100 ? '✅ Can decrypt repos' : `Need ${100 - balance} more GIT to decrypt`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-600">{balance} GIT</p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min((balance / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Verify GitHub */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Step 1: Verify GitHub Account</h3>
        <Button
          onClick={handleVerify}
          disabled={verifying || verified || !address}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90"
        >
          {verifying && "⏳ Waiting for verification..."}
          {verified && "✅ GitHub Verified"}
          {!verifying && !verified && "🔗 Connect GitHub"}
        </Button>
        
        {!address && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Connect your wallet first
          </p>
        )}
      </div>

      {/* Verification Success */}
      {verified && proofs.length > 0 && (
        <div className="border rounded-lg p-6 bg-primary/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-lg font-semibold">GitHub Account Verified</h3>
          </div>
          
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Username:</span>
              <span className="font-mono font-medium">{getUsername(proofs[0])}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verified:</span>
              <span className="font-mono text-xs">{formatTimestamp(proofs[0].claimData.timestampS)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Proof ID:</span>
              <span className="font-mono text-xs">{proofs[0].identifier.slice(0, 20)}...</span>
            </div>
          </div>

          {/* Step 2: Mint DataCoin */}
          {!mintData && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3">Step 2: Mint DataCoin & Earn Rewards</h4>
              <Button
                onClick={handleUploadAndMint}
                disabled={uploading || minting}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {uploading && "📤 Uploading to Lighthouse..."}
                {minting && "🪙 Minting Tokens..."}
                {!uploading && !minting && "🎁 Mint DataCoin & Earn 10 GIT"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Upload Success */}
      {uploadData && (
        <div className="border rounded-lg p-6 bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📦</span>
            <h3 className="font-semibold">Proof Stored on Lighthouse</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">CID:</span>
              <span className="font-mono">{uploadData.cid.slice(0, 20)}...</span>
            </div>
            <a 
              href={uploadData.ipfsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline text-xs block"
            >
              View on IPFS →
            </a>
          </div>
        </div>
      )}

      {/* Mint Success
      {mintData && (
        <div className="border rounded-lg p-6 bg-green-50 dark:bg-green-950/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎉</span>
            <h3 className="font-semibold">Tokens Minted Successfully!</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-bold text-green-600">{mintData.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction:</span>
              <a 
                href={mintData.explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline text-xs"
              >
                {mintData.transactionHash.slice(0, 10)}... →
              </a>
            </div>
          </div>
        </div>
      )} */}
      {/* Mint Success */}
{mintData && (
  <div className="border rounded-lg p-6 bg-green-50 dark:bg-green-950/20">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-2xl">🎉</span>
      <h3 className="font-semibold">Tokens Minted Successfully!</h3>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Amount:</span>
        <span className="font-bold text-green-600">{mintData.amount}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Transaction:</span>
        <a 
          href={mintData.explorerUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 underline text-xs"
        >
          {mintData.transactionHash.slice(0, 10)}... →
        </a>
      </div>
    </div>

    {/* ADD THIS TEMPORARY DEBUG BUTTON */}
    <Button
      onClick={() => fetchUserRepos(getUsername(proofs[0]))}
      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
    >
      🔄 Load My Repos (Debug)
    </Button>
  </div>
)}


      {/* NEW: Repository Backup Section */}
      {repos.length > 0 && (
        <div className="border rounded-lg p-6 bg-purple-50 dark:bg-purple-950/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💾</span>
            <div>
              <h3 className="text-lg font-semibold">Step 3: Backup Your Repositories</h3>
              <p className="text-xs text-muted-foreground">
                Encrypt & store forever on Lighthouse • Earn 30 GIT per backup
              </p>
            </div>
          </div>

          {loadingRepos && (
            <p className="text-sm text-muted-foreground">Loading repositories...</p>
          )}

          {!loadingRepos && (
            <>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Found {repos.length} repositories
                </p>
              </div>

              <select
                value={selectedRepo || ''}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4 text-sm bg-white dark:bg-gray-800"
              >
                <option value="">📂 Select a repository to backup...</option>
                {repos.map((repo) => (
                  <option key={repo.id} value={repo.full_name}>
                    {repo.name} {repo.language && `• ${repo.language}`} • {repo.stars}⭐ • {(repo.size / 1024).toFixed(1)}MB
                  </option>
                ))}
              </select>

              <Button
                onClick={handleBackupRepo}
                disabled={!selectedRepo || backingUp}
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {backingUp && "🔐 Encrypting & Uploading..."}
                {!backingUp && "💾 Backup Repository & Earn 30 GIT"}
              </Button>

              {selectedRepo && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  ⚡ Your code will be encrypted with AES-256 and stored on IPFS forever
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* NEW: Backup Success Message */}
      {backupData && (
        <div className="border rounded-lg p-6 bg-purple-50 dark:bg-purple-950/20 animate-in fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎊</span>
            <h3 className="font-semibold">Repository Backed Up!</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Repository:</span>
              <span className="font-mono font-medium text-xs">{backupData.repoFullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size:</span>
              <span className="font-medium">{backupData.sizeMB} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CID:</span>
              <span className="font-mono text-xs">{backupData.cid.slice(0, 20)}...</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Reward:</span>
              <span className="font-bold text-purple-600">+30 GIT 🎁</span>
            </div>
            <a 
              href={backupData.ipfsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 underline text-xs block mt-2"
            >
              View Backup on IPFS →
            </a>
          </div>
        </div>
      )}

      {/* NEW: Backup List */}
      {backupList.length > 0 && (
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Backed Up Repos ({backupList.length})</h3>
            {balance >= 100 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                ✅ Can Decrypt
              </span>
            )}
          </div>
          <div className="space-y-3">
            {backupList.map((backup, index) => (
              <div key={index} className="border rounded p-3 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-mono text-sm font-medium">{backup.repoFullName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {backup.sizeMB} MB • {new Date(backup.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={backup.ipfsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View
                    </a>
                    {balance >= 100 ? (
                      <button className="text-xs text-green-600 hover:underline">
                        Decrypt
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">
                        🔒 Need 100 GIT
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {balance < 100 && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              💡 Backup {Math.ceil((100 - balance) / 30)} more repos to unlock decryption!
            </p>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <span className="text-lg">❌</span>
            <div>
              <strong>Error</strong>
             <p className="mt-1">{error || 'An error occurred'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}