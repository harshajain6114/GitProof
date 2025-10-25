import { NextRequest, NextResponse } from 'next/server'
import lighthouse from '@lighthouse-web3/sdk'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { repoFullName, username, walletAddress } = await request.json()

    if (!repoFullName || !username || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY

    if (!LIGHTHOUSE_API_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    console.log(`📦 Backing up repo: ${repoFullName}`)

    const zipUrl = `https://api.github.com/repos/${repoFullName}/zipball`
    const zipResponse = await fetch(zipUrl, {
      headers: GITHUB_TOKEN ? {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      } : {
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!zipResponse.ok) {
      throw new Error('Failed to download repo')
    }

    const arrayBuffer = await zipResponse.arrayBuffer()
    const zipBuffer = Buffer.from(arrayBuffer)

    console.log(`📊 Repo size: ${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB`)

    const encryptionKey = crypto
      .createHash('sha256')
      .update(LIGHTHOUSE_API_KEY)
      .digest()
      .slice(0, 32)

    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv)
    
    let encrypted = cipher.update(zipBuffer)
    encrypted = Buffer.concat([encrypted, cipher.final()])

    const finalEncryptedBuffer = Buffer.concat([iv, encrypted])

    console.log('🔐 Repo encrypted, uploading to Lighthouse...')

    const uploadResponse = await lighthouse.uploadBuffer(
      finalEncryptedBuffer,
      LIGHTHOUSE_API_KEY
    )

    if (!uploadResponse?.data?.Hash) {
      throw new Error('Failed to upload to Lighthouse')
    }

    const cid = uploadResponse.data.Hash

    console.log('✅ Repo backed up! CID:', cid)

    const metadata = {
      repoFullName,
      username,
      walletAddress,
      cid,
      encrypted: true,
      size: zipBuffer.length,
      sizeMB: (zipBuffer.length / 1024 / 1024).toFixed(2),
      timestamp: Date.now(),
      ipfsUrl: `https://gateway.lighthouse.storage/ipfs/${cid}`,
    }

    return NextResponse.json({
      success: true,
      message: 'Repository backed up successfully',
      data: metadata,
    })
  } catch (error: any) {
    console.error('❌ Error backing up repo:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to backup repo' },
      { status: 500 }
    )
  }
}