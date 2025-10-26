"use client"
import { useState, useEffect } from "react"
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'
import { useAccount } from "wagmi"
import { ethers } from "ethers"
import { BalanceDisplay } from "./balance-display"
import { ReferralSection } from "./referral-section"
import { VerificationForm } from "./verification-form"
import { MintingForm } from "./minting-form"
import { ProofUploadStatus } from "./proof-upload-status"
import { TokenMintStatus } from "./token-mint-status"
import { RepositorySelector } from "./repository-selector"
import { BackupConfirmation } from "./backup-confirmation"
import { BackupVault } from "./backup-vault"
import { ReclaimProof, GitHubRepo } from "./github-verifier-types"

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
  
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [backingUp, setBackingUp] = useState(false)
  const [backupData, setBackupData] = useState<any>(null)
  const [backupList, setBackupList] = useState<any[]>([])
  
  const [balance, setBalance] = useState<number>(0)
  const [referralLink, setReferralLink] = useState<string>('')
  const [showReferralCopied, setShowReferralCopied] = useState(false)

  useEffect(() => {
    if (address) checkBalance()
  }, [address, mintData, backupData])

  useEffect(() => {
    if (address) {
      setReferralLink(`${window.location.origin}?ref=${address}`)
    }
  }, [address])

  useEffect(() => {
    if (verified && address) {
      const urlParams = new URLSearchParams(window.location.search)
      const referrer = urlParams.get('ref')
      
      if (referrer && referrer !== address && ethers.isAddress(referrer)) {
        const rewardedKey = `referral_rewarded_${address}`
        if (!localStorage.getItem(rewardedKey)) {
          fetch('/api/referral/reward', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referrerAddress: referrer })
          }).then(() => {
            localStorage.setItem(rewardedKey, 'true')
          })
        }
      }
    }
  }, [verified, address])

  async function checkBalance() {
    if (!address) return
    
    try {
      const response = await fetch('/api/github/check-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      })

      if (response.ok) {
        const result = await response.json()
        setBalance(result.balance)
      }
    } catch (err) {
      console.error('Error checking balance:', err)
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
          const proofsArray = Array.isArray(proofsData) ? proofsData : [proofsData]
          setProofs(proofsArray)
          setVerified(true)
          setVerifying(false)
        },
        onError: (err: any) => {
          console.error("Verification failed:", err)
          setError(err instanceof Error ? err.message : "Verification failed")
          setVerifying(false)
        },
      })

      await reclaimProofRequest.triggerReclaimFlow()
      await sessionPromise
     
    } catch (err) {
      console.error("Error:", err)
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

      setUploading(false)
      setMinting(true)

      const mintResponse = await fetch('/api/datacoin/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientAddress: address,
          proofIdentifier: proof.identifier,
          amount: '10'
        })
      })

      if (!mintResponse.ok) {
        throw new Error('Failed to mint tokens')
      }

      const mintResult = await mintResponse.json()
      setMintData(mintResult.data)
      setMinting(false)

      await fetchUserRepos(username)

    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Failed to process")
      setUploading(false)
      setMinting(false)
    }
  }

  async function fetchUserRepos(username: string) {
    try {
      setLoadingRepos(true)

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
      setLoadingRepos(false)
    } catch (err) {
      console.error("Error fetching repos:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch repos")
      setLoadingRepos(false)
    }
  }

  async function handleBackupRepo() {
    if (!selectedRepo || !address) return

    try {
      setBackingUp(true)
      setError(null)

      const username = getUsername(proofs[0])

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
      
      setBackupList(prev => [...prev, result.data])
      setBackupData(result.data)

      await mintBackupReward()

      setBackingUp(false)
      setSelectedRepo(null)
    } catch (err) {
      console.error("Error backing up repo:", err)
      setError(err instanceof Error ? err.message : "Failed to backup repo")
      setBackingUp(false)
    }
  }

  async function mintBackupReward() {
    try {
      const response = await fetch('/api/datacoin/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientAddress: address,
          proofIdentifier: `backup-${Date.now()}`,
          amount: '30'
        })
      })

      if (response.ok) {
        console.log("Backup reward minted: 30 GIT")
      }
    } catch (err) {
      console.error("Error minting backup reward:", err)
    }
  }

  function copyReferralLink() {
    navigator.clipboard.writeText(referralLink)
    setShowReferralCopied(true)
    setTimeout(() => setShowReferralCopied(false), 2000)
  }

  const getUsername = (proof: ReclaimProof): string => {
    try {
      const context = JSON.parse(proof.claimData.context)
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
      <BalanceDisplay balance={balance} />

      {address && (
        <ReferralSection 
          referralLink={referralLink}
          onCopy={copyReferralLink}
          showCopied={showReferralCopied}
        />
      )}

      <VerificationForm 
        onVerify={handleVerify}
        verifying={verifying}
        verified={verified}
        walletConnected={!!address}
      />

      {verified && proofs.length > 0 && !mintData && (
        <MintingForm 
          proof={proofs[0]}
          username={getUsername(proofs[0])}
          timestamp={formatTimestamp(proofs[0].claimData.timestampS)}
          onMint={handleUploadAndMint}
          uploading={uploading}
          minting={minting}
        />
      )}

      {uploadData && <ProofUploadStatus data={uploadData} />}

      {mintData && (
        <TokenMintStatus 
          data={mintData}
          onLoadRepos={() => fetchUserRepos(getUsername(proofs[0]))}
        />
      )}

      <RepositorySelector 
        repos={repos}
        selectedRepo={selectedRepo}
        onSelectRepo={setSelectedRepo}
        onBackup={handleBackupRepo}
        backingUp={backingUp}
        loadingRepos={loadingRepos}
      />

      {backupData && <BackupConfirmation data={backupData} />}

      <BackupVault backups={backupList} balance={balance} />

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <span className="font-bold">Error:</span>
            <p>{String(error)}</p>
          </div>
        </div>
      )}
    </div>
  )
}