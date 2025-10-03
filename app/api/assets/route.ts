import { NextResponse } from "next/server"

// Mock database - In production, this would connect to PostgreSQL
// This simulates the backend API endpoint for fetching assets
const mockAssets = [
  {
    id: 1,
    name: "Luxury Apartment in Mumbai",
    price: 100000,
    supply: 50,
    location: "Mumbai, India",
    type: "Residential",
    roi: 18.5, // Added ROI data
  },
  {
    id: 2,
    name: "Beachfront Villa in Goa",
    price: 250000,
    supply: 20,
    location: "Goa, India",
    type: "Residential",
    roi: 20.2, // Added ROI data
  },
  {
    id: 3,
    name: "Commercial Space in Bangalore",
    price: 150000,
    supply: 35,
    location: "Bangalore, India",
    type: "Commercial",
    roi: 19.8, // Added ROI data
  },
  {
    id: 4,
    name: "Penthouse in Delhi",
    price: 300000,
    supply: 15,
    location: "Delhi, India",
    type: "Residential",
    roi: 17.5, // Added ROI data
  },
  {
    id: 5,
    name: "Co-living Space in Pune",
    price: 75000,
    supply: 60,
    location: "Pune, India",
    type: "Co-living",
    roi: 21.0,
  },
  {
    id: 6,
    name: "Luxury Resort in Kerala",
    price: 500000,
    supply: 10,
    location: "Kerala, India",
    type: "Resort",
    roi: 22.5,
  },
]

// GET /api/assets - Returns list of all available assets
export async function GET() {
  try {
    // In production, this would query PostgreSQL:
    // const result = await pool.query('SELECT * FROM assets ORDER BY id')
    // return NextResponse.json(result.rows)

    return NextResponse.json(mockAssets)
  } catch (error) {
    console.error("Error fetching assets:", error)
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 })
  }
}

// Helper function to update asset supply (used by buy endpoint)
export function updateAssetSupply(assetId: number, quantityPurchased: number) {
  const asset = mockAssets.find((a) => a.id === assetId)
  if (asset) {
    asset.supply -= quantityPurchased
  }
}

// Helper function to get asset by ID
export function getAssetById(assetId: number) {
  return mockAssets.find((a) => a.id === assetId)
}
