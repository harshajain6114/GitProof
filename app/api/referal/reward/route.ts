import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

const DATACOIN_ABI = [
  "function mint(address to, uint256 amount) public",
]

export async function POST(request: NextRequest) {
  try {
    const { referrerAddress } = await request.json()

    if (!referrerAddress || !ethers.isAddress(referrerAddress)) {
      return NextResponse.json(
        { error: 'Invalid referrer address' },
        { status: 400 }
      )
    }

    const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY
    const DATACOIN_ADDRESS = process.env.NEXT_PUBLIC_DATACOIN_ADDRESS
    const RPC_URL = process.env.RPC_URL || 'https://sepolia.infura.io/v3/160fe548b8d94fca91f4a3826acd742d'

    if (!MINTER_PRIVATE_KEY || !DATACOIN_ADDRESS) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    console.log('🎁 Minting referral reward to:', referrerAddress)

    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const minterWallet = new ethers.Wallet(MINTER_PRIVATE_KEY, provider)
    const datacoinContract = new ethers.Contract(
      DATACOIN_ADDRESS,
      DATACOIN_ABI,
      minterWallet
    )

    const amountToMint = ethers.parseUnits('50', 18) // 50 GIT

    const tx = await datacoinContract.mint(referrerAddress, amountToMint)
    const receipt = await tx.wait()

    console.log('✅ Referral reward minted!')

    return NextResponse.json({
      success: true,
      message: 'Referral reward minted',
      data: {
        transactionHash: tx.hash,
        amount: '50 GIT',
        blockNumber: receipt.blockNumber,
      }
    })

  } catch (error: any) {
    console.error('❌ Error minting referral reward:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to mint referral reward' },
      { status: 500 }
    )
  }
}