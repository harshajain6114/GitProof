// app/api/datacoin/mint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// Minimal ERC20 ABI for minting
const DATACOIN_ABI = [
  "function mint(address to, uint256 amount) public",
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipientAddress, proofIdentifier } = body

    // Validate input
    if (!recipientAddress || !proofIdentifier) {
      return NextResponse.json(
        { error: 'Missing recipientAddress or proofIdentifier' },
        { status: 400 }
      )
    }

    // Validate address format
    if (!ethers.isAddress(recipientAddress)) {
      return NextResponse.json(
        { error: 'Invalid recipient address' },
        { status: 400 }
      )
    }

    // Get environment variables
    const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY
    const DATACOIN_ADDRESS = process.env.NEXT_PUBLIC_DATACOIN_ADDRESS
    const RPC_URL = process.env.RPC_URL || 'https://sepolia.infura.io/v3/160fe548b8d94fca91f4a3826acd742d' // ✅ Ethereum Sepolia

    if (!MINTER_PRIVATE_KEY || !DATACOIN_ADDRESS) {
      return NextResponse.json(
        { error: 'Minter credentials not configured' },
        { status: 500 }
      )
    }

    console.log('🪙 Minting tokens to:', recipientAddress)

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const minterWallet = new ethers.Wallet(MINTER_PRIVATE_KEY, provider)
    const datacoinContract = new ethers.Contract(
      DATACOIN_ADDRESS,
      DATACOIN_ABI,
      minterWallet
    )

    // Get decimals
    const decimals = await datacoinContract.decimals()
    
    // Mint 10 GIT tokens (adjust amount as needed)
    const amountToMint = ethers.parseUnits('10', decimals)

    console.log(`💰 Minting ${ethers.formatUnits(amountToMint, decimals)} GIT to ${recipientAddress}`)

    // Execute mint transaction
    const tx = await datacoinContract.mint(recipientAddress, amountToMint)
    console.log('⏳ Transaction sent:', tx.hash)

    // Wait for confirmation
    const receipt = await tx.wait()
    console.log('✅ Tokens minted! Block:', receipt.blockNumber)

    return NextResponse.json({
      success: true,
      message: 'Tokens minted successfully',
      data: {
        transactionHash: tx.hash,
        recipient: recipientAddress,
        amount: '10 GIT',
        blockNumber: receipt.blockNumber,
        explorerUrl: `https://sepolia.etherscan.org/tx/${tx.hash}` // ✅ Changed to Ethereum Sepolia explorer
      }
    })

  } catch (error: any) {
    console.error('❌ Error minting tokens:', error)
    
    // Handle common errors
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return NextResponse.json(
        { error: 'Minter account has insufficient gas funds' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to mint tokens' },
      { status: 500 }
    )
  }
}