export const runtime = 'nodejs' // Add this line at the very top

import { NextRequest, NextResponse } from "next/server"
import lighthouse from "@lighthouse-web3/sdk"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { proof, walletAddress, username } = body

    // Validate input
    if (!proof || !walletAddress || !username) {
      return NextResponse.json(
        { error: "Missing required fields: proof, walletAddress, username" },
        { status: 400 }
      )
    }

    // Check Lighthouse API key
    const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY
    if (!LIGHTHOUSE_API_KEY) {
      return NextResponse.json(
        { error: "Lighthouse API key not configured" },
        { status: 500 }
      )
    }

    console.log("🔐 Encrypting proof for:", username)

    // Convert proof to string
    const proofString = JSON.stringify(proof, null, 2)
    const buffer = Buffer.from(proofString, "utf-8")

    // Create encryption key and IV
    const encryptionKey = crypto
      .createHash("sha256")
      .update(LIGHTHOUSE_API_KEY)
      .digest()
      .slice(0, 32)

    const iv = crypto.randomBytes(16)

    // Encrypt the data
    const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv)
    let encrypted = cipher.update(buffer)
    encrypted = Buffer.concat([encrypted, cipher.final()])

    // Combine IV + encrypted data
    const finalEncryptedBuffer = Buffer.concat([iv, encrypted])

    console.log("📤 Uploading to Lighthouse...")

    // Upload to Lighthouse - ONLY 2 PARAMETERS!
    const uploadResponse = await lighthouse.uploadBuffer(
      finalEncryptedBuffer,
      LIGHTHOUSE_API_KEY
    )

    console.log("📦 Upload response:", uploadResponse)

    // Check if upload was successful
    if (!uploadResponse || !uploadResponse.data || !uploadResponse.data.Hash) {
      console.error("❌ Invalid upload response:", uploadResponse)
      return NextResponse.json(
        { error: "Invalid response from Lighthouse" },
        { status: 500 }
      )
    }

    const cid = uploadResponse.data.Hash
    console.log("✅ Encrypted proof uploaded! CID:", cid)

    // Metadata
    const metadata = {
      uploader: walletAddress,
      username,
      proofIdentifier: proof.identifier,
      cid,
      encrypted: true,
      encryption: "AES-256-CBC + Lighthouse upload",
      timestamp: Math.floor(Date.now() / 1000),
      ipfsUrl: `https://gateway.lighthouse.storage/ipfs/${cid}`,
    }

    return NextResponse.json({
      success: true,
      message: "Proof encrypted and uploaded successfully",
      data: metadata,
    })
  } catch (error: any) {
    console.error("❌ Error uploading encrypted proof:", error)
    
    // More detailed error logging
    if (error.response) {
      console.error("API Error Response:", error.response.data)
    }
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to upload encrypted proof",
        details: error.response?.data || error.toString()
      },
      { status: 500 }
    )
  }
}