import { NextResponse } from "next/server"
import { getAssetById, updateAssetSupply } from "../assets/route"
import { addTransaction } from "../transactions/route"

// POST /api/buy - Process asset purchase
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { assetId, quantity, buyerName } = body

    // Validation
    if (!assetId || !quantity || !buyerName) {
      return NextResponse.json({ error: "Missing required fields: assetId, quantity, buyerName" }, { status: 400 })
    }

    if (quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 })
    }

    // Get asset from database
    const asset = getAssetById(assetId)

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    // Check if enough supply is available
    if (asset.supply < quantity) {
      return NextResponse.json({ error: `Only ${asset.supply} tokens available` }, { status: 400 })
    }

    // In production, this would be a database transaction:
    // BEGIN TRANSACTION
    // UPDATE assets SET supply = supply - $1 WHERE id = $2
    // INSERT INTO transactions (asset_id, buyer, quantity, timestamp) VALUES (...)
    // COMMIT

    // Update asset supply
    updateAssetSupply(assetId, quantity)

    // Create transaction record
    const transaction = addTransaction({
      asset_id: assetId,
      asset_name: asset.name,
      buyer: buyerName,
      quantity,
      total_price: asset.price * quantity,
    })

    return NextResponse.json({
      success: true,
      message: "Purchase successful",
      transaction,
      remainingSupply: asset.supply,
    })
  } catch (error) {
    console.error("Error processing purchase:", error)
    return NextResponse.json({ error: "Failed to process purchase" }, { status: 500 })
  }
}
