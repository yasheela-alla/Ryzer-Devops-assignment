import { NextResponse } from "next/server"

// Mock database for transactions
// In production, this would be stored in PostgreSQL
const mockTransactions: Array<{
  id: number
  asset_id: number
  asset_name: string
  buyer: string
  quantity: number
  timestamp: string
  total_price: number
}> = []

let transactionIdCounter = 1

// GET /api/transactions - Returns list of all transactions
export async function GET() {
  try {
    // In production, this would query PostgreSQL:
    // const result = await pool.query(`
    //   SELECT t.*, a.name as asset_name
    //   FROM transactions t
    //   JOIN assets a ON t.asset_id = a.id
    //   ORDER BY t.timestamp DESC
    // `)
    // return NextResponse.json(result.rows)

    // Return transactions in reverse chronological order
    const sortedTransactions = [...mockTransactions].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return NextResponse.json(sortedTransactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

// Helper function to add a transaction (used by buy endpoint)
export function addTransaction(transaction: {
  asset_id: number
  asset_name: string
  buyer: string
  quantity: number
  total_price: number
}) {
  const newTransaction = {
    id: transactionIdCounter++,
    ...transaction,
    timestamp: new Date().toISOString(),
  }

  mockTransactions.push(newTransaction)
  return newTransaction
}
