
export interface ReclaimProof {
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

export interface ProofContext {
  extractedParameters: {
    username?: string
    [key: string]: any
  }
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  size: number
  language: string
  stars: number
  updated_at: string
}

export interface UploadData {
  cid: string
  ipfsUrl: string
}

export interface MintData {
  amount: string
  transactionHash: string
  explorerUrl: string
}

export interface BackupData {
  repoFullName: string
  cid: string
  ipfsUrl: string
  sizeMB: string
  timestamp: string
}
