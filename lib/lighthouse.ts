import lighthouse from '@lighthouse-web3/sdk'

export async function uploadToLighthouse(data: any, apiKey: string) {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data, null, 2)
    
    // Create a File object
    const blob = new Blob([jsonString], { type: 'application/json' })
    const file = new File([blob], 'github-data.json', { type: 'application/json' })

    // Upload to Lighthouse
    const output = await lighthouse.upload([file], apiKey)
    
    console.log("Data Uploaded to Lighthouse:", output)
    
    return {
      cid: output.data.Hash,
      url: `https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`
    }
  } catch (error) {
    console.error("Lighthouse upload error:", error)
    throw new Error("Failed to upload to Lighthouse")
  }
}