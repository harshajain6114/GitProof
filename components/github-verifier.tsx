// "use client"

// import { useState } from "react"
// import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'
// import { Button } from "@/components/ui/button"
// import { useAccount } from "wagmi"

// // Reclaim SDK types based on actual API response
// interface ReclaimProof {
//   identifier: string
//   claimData: {
//     provider: string
//     parameters: string
//     owner: string
//     timestampS: string
//     context: string // JSON string containing extractedParameters
//     identifier: string
//     epoch: string
//   }
//   signatures: string[]
//   witnesses: Array<{
//     id: string
//     url: string
//   }>
// }

// interface ProofContext {
//   contextAddress: string
//   contextMessage: string
//   extractedParameters: {
//     username?: string
//     [key: string]: any
//   }
//   providerHash: string
// }

// interface DataCoin {
//   id: string
//   walletAddress: string
//   githubUsername: string
//   cid: string
//   url: string
//   stats: {
//     commits: number
//     repos: number
//     stars: number
//   }
//   rewardTokens: number
//   mintedAt: number
// }

// export function GithubVerifier() {
//   const { address, isConnected } = useAccount()
//   const [verified, setVerified] = useState(false)
//   const [verifying, setVerifying] = useState(false)
//   const [minting, setMinting] = useState(false)
//   const [proofs, setProofs] = useState<ReclaimProof[]>([])
//   const [dataCoin, setDataCoin] = useState<DataCoin | null>(null)
//   const [error, setError] = useState<string | null>(null)

//   async function handleVerify() {
//     if (!isConnected) {
//       setError("Please connect your wallet first")
//       return
//     }

//     try {
//       setVerifying(true)
//       setError(null)

//       const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID
//       const APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET
//       const PROVIDER_ID = "6d3f6753-7ee6-49ee-a545-62f1b1822ae5"

//       if (!APP_ID || !APP_SECRET) {
//         throw new Error("Missing Reclaim credentials in .env.local")
//       }

//       console.log("🔧 Initializing Reclaim...")

//       const reclaimProofRequest = await ReclaimProofRequest.init(
//         APP_ID,
//         APP_SECRET,
//         PROVIDER_ID
//       )

//       console.log("✅ Setting up session listener...")

//       // Start session listener FIRST
//       const sessionPromise = reclaimProofRequest.startSession({
//         onSuccess: async (proofsData: any) => {
//           console.log("✅ Verification successful! Proofs:", proofsData)

//           const proofsArray = Array.isArray(proofsData) ? proofsData : [proofsData]
//           setProofs(proofsArray)
//           setVerified(true)

//           // Save proof to backend
//           try {
//             const proof = proofsArray[0]
//             const context: ProofContext = JSON.parse(proof.claimData.context)
//             const githubUsername = context.extractedParameters?.username

//             if (githubUsername && address) {
//               await fetch("/api/verify/saveProof", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   walletAddress: address,
//                   proof: proof,
//                   githubUsername,
//                 }),
//               })
//               console.log("✅ Proof saved to backend")
//             }
//           } catch (err) {
//             console.error("Failed to save proof:", err)
//           }

//           setVerifying(false)
//         },
//         onError: (err: any) => {
//           console.error("❌ Verification failed:", err)
//           setError(err instanceof Error ? err.message : "Verification failed")
//           setVerifying(false)
//         },
//       })

//       console.log("🚀 Triggering verification flow...")
//       await reclaimProofRequest.triggerReclaimFlow()
//       await sessionPromise
     
//     } catch (err) {
//       console.error("❌ Error initializing verification:", err)
//       setError(err instanceof Error ? err.message : "Failed to start verification")
//       setVerifying(false)
//     }
//   }

//   async function handleMintDataCoin() {
//     if (!proofs.length || !address) return
    
//     try {
//       setMinting(true)
//       setError(null)
      
//       const proof = proofs[0]
//       const context: ProofContext = JSON.parse(proof.claimData.context)
//       const githubUsername = context.extractedParameters?.username
      
//       if (!githubUsername) {
//         throw new Error("GitHub username not found in proof")
//       }

//       console.log("🪙 Minting DataCoin for:", githubUsername)
      
//       const res = await fetch("/api/datacoin/mint", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           walletAddress: address,
//           githubUsername,
//         }),
//       })
      
//       const data = await res.json()
      
//       if (!res.ok) {
//         throw new Error(data.error || "Failed to mint DataCoin")
//       }
      
//       setDataCoin(data.dataCoin)
//       console.log("🎉 DataCoin minted successfully:", data.dataCoin)
//     } catch (err: any) {
//       console.error("❌ Mint error:", err)
//       setError(err.message || "Failed to mint DataCoin")
//     } finally {
//       setMinting(false)
//     }
//   }

//   const getUsername = (proof: ReclaimProof): string => {
//     try {
//       const context: ProofContext = JSON.parse(proof.claimData.context)
//       return context.extractedParameters?.username || "Unknown"
//     } catch {
//       return "Unknown"
//     }
//   }

//   const formatTimestamp = (timestampS: string): string => {
//     try {
//       return new Date(parseInt(timestampS) * 1000).toLocaleString()
//     } catch {
//       return timestampS
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="text-center">
//         {!verified && (
//           <Button
//             onClick={handleVerify}
//             disabled={verifying || !isConnected}
//             size="lg"
//             className="bg-primary hover:bg-primary/90 text-primary-foreground"
//           >
//             {!isConnected && "🔌 Connect Wallet First"}
//             {isConnected && verifying && "⏳ Waiting for verification..."}
//             {isConnected && !verifying && "🔗 Connect GitHub"}
//           </Button>
//         )}

//         {verified && !dataCoin && (
//           <Button
//             onClick={handleMintDataCoin}
//             disabled={minting}
//             size="lg"
//             className="bg-green-500 hover:bg-green-600 text-white"
//           >
//             {minting ? "🔄 Minting DataCoin..." : "🪙 Mint DataCoin & Earn Rewards"}
//           </Button>
//         )}
        
//         {verifying && (
//           <div className="mt-3 space-y-2">
//             <p className="text-sm text-muted-foreground">
//               Complete the verification in the popup window or scan the QR code
//             </p>
//             <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
//               <div className="animate-pulse">⏳</div>
//               <span>Waiting for proof...</span>
//             </div>
//           </div>
//         )}

//         {minting && (
//           <div className="mt-3 space-y-2">
//             <p className="text-sm text-muted-foreground">
//               Fetching GitHub data and uploading to Lighthouse...
//             </p>
//             <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
//               <div className="animate-spin">⚙️</div>
//               <span>Processing...</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {error && (
//         <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
//           <div className="flex items-start gap-2">
//             <span className="text-lg">❌</span>
//             <div>
//               <strong>Error</strong>
//               <p className="mt-1">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {verified && proofs.length > 0 && !dataCoin && (
//         <div className="space-y-3">
//           {proofs.map((proof, index) => (
//             <div
//               key={proof.identifier || index}
//               className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 px-4 py-3 rounded-lg"
//             >
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="text-lg">✅</span>
//                 <p className="text-sm font-semibold text-primary">
//                   GitHub Account Verified
//                 </p>
//               </div>
              
//               <div className="space-y-1.5 text-xs">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Username:</span>
//                   <span className="font-mono font-medium">{getUsername(proof)}</span>
//                 </div>
                
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Verified:</span>
//                   <span className="font-mono">{formatTimestamp(proof.claimData.timestampS)}</span>
//                 </div>
                
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Proof ID:</span>
//                   <span className="font-mono text-[10px]">
//                     {proof.identifier.slice(0, 16)}...
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Witnesses:</span>
//                   <span className="font-medium">{proof.witnesses?.length || 0}</span>
//                 </div>
//               </div>

//               <div className="mt-3 pt-3 border-t border-primary/10">
//                 <p className="text-xs text-muted-foreground text-center">
//                   Click "Mint DataCoin" to fetch your GitHub stats and earn rewards! 🎁
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {dataCoin && (
//         <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 px-4 py-4 rounded-lg space-y-3">
//           <div className="flex items-center gap-2">
//             <span className="text-2xl">🎉</span>
//             <div>
//               <p className="text-sm font-bold text-green-400">
//                 DataCoin Minted Successfully!
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 Your GitHub data is now on-chain
//               </p>
//             </div>
//           </div>

//           <div className="space-y-2 text-xs">
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">GitHub User:</span>
//               <span className="font-mono font-medium">{dataCoin.githubUsername}</span>
//             </div>
            
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Commits:</span>
//               <span className="font-medium">{dataCoin.stats.commits}</span>
//             </div>
            
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Repositories:</span>
//               <span className="font-medium">{dataCoin.stats.repos}</span>
//             </div>
            
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Stars Received:</span>
//               <span className="font-medium">{dataCoin.stats.stars}</span>
//             </div>

//             <div className="flex justify-between pt-2 border-t border-green-500/10">
//               <span className="text-muted-foreground font-semibold">Reward Tokens:</span>
//               <span className="font-bold text-green-400 text-base">
//                 {dataCoin.rewardTokens} 🪙
//               </span>
//             </div>

//             <div className="pt-2 border-t border-green-500/10">
//               <p className="text-muted-foreground mb-1">Data CID:</p>
//               <p className="font-mono text-[10px] break-all bg-black/5 p-2 rounded">
//                 {dataCoin.cid}
//               </p>
//             </div>
//           </div>

//           <a 
//             href={dataCoin.url} 
//             target="_blank" 
//             rel="noopener noreferrer"
//             className="block text-center text-xs text-primary hover:underline pt-2 border-t border-green-500/10"
//           >
//             View Data on Lighthouse →
//           </a>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"
import { useState } from "react"
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
          proofIdentifier: proof.identifier
        })
      })

      if (!mintResponse.ok) {
        throw new Error('Failed to mint tokens')
      }

      const mintResult = await mintResponse.json()
      setMintData(mintResult.data)
      console.log("✅ Tokens minted:", mintResult.data)

      setMinting(false)

    } catch (err) {
      console.error("❌ Error:", err)
      setError(err instanceof Error ? err.message : "Failed to process")
      setUploading(false)
      setMinting(false)
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
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <span className="text-lg">❌</span>
            <div>
              <strong>Error</strong>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}