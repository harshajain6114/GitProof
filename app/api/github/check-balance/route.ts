import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

const DATACOIN_ABI = [
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
]

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    const DATACOIN_ADDRESS = process.env.NEXT_PUBLIC_DATACOIN_ADDRESS
    const RPC_URL = process.env.RPC_URL || 'https://sepolia.infura.io/v3/160fe548b8d94fca91f4a3826acd742d'

    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const datacoinContract = new ethers.Contract(
      DATACOIN_ADDRESS!,
      DATACOIN_ABI,
      provider
    )

    const balance = await datacoinContract.balanceOf(walletAddress)
    const decimals = await datacoinContract.decimals()
    const balanceFormatted = Number(ethers.formatUnits(balance, decimals))

    console.log(`💰 User balance: ${balanceFormatted} GIT`)

    return NextResponse.json({
      success: true,
      balance: balanceFormatted,
      canDecrypt: balanceFormatted >= 100
    })

  } catch (error: any) {
    console.error('❌ Error checking balance:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check balance' },
      { status: 500 }
    )
  }
}