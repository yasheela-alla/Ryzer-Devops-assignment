"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Clock, User, Building2, Hash, Search, DollarSign, TrendingUp } from "lucide-react"

// Transaction type definition
interface Transaction {
  id: number
  asset_id: number
  asset_name?: string
  buyer: string
  quantity: number
  timestamp: string
  total_price?: number
  price?: number
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch transactions from backend API
  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = transactions.filter(
        (txn) =>
          txn.asset_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          txn.buyer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredTransactions(filtered)
    } else {
      setFilteredTransactions(transactions)
    }
  }, [searchQuery, transactions])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions")
      const data = await response.json()
      setTransactions(data)
      setFilteredTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalVolume = transactions.reduce((sum, txn) => sum + (txn.total_price || 0), 0)
  const totalTransactions = transactions.length

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-500">
              <span className="font-sans text-xl font-bold text-white">R</span>
            </div>
            <span className="font-sans text-xl font-bold">Ryzer</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/assets">
              <Button variant="ghost">Assets</Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="ghost">Portfolio</Button>
            </Link>
            <Link href="/transactions">
              <Button variant="default">Transactions</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="mb-2 font-sans text-4xl font-bold">Transaction History</h1>
          <p className="text-lg text-muted-foreground">View all completed asset purchases on the platform</p>
        </div>

        {!loading && transactions.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Transaction Volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-sans text-3xl font-bold text-indigo-600">${totalVolume.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Total Transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-sans text-3xl font-bold text-indigo-600">{totalTransactions}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by asset name or buyer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex animate-pulse items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 rounded bg-muted" />
                      <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building2 className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 font-sans text-xl font-bold">
                {searchQuery ? "No matching transactions" : "No transactions yet"}
              </h3>
              <p className="mb-6 text-muted-foreground">
                {searchQuery
                  ? "Try a different search term"
                  : "Start trading tokenized assets to see your transaction history"}
              </p>
              {!searchQuery && (
                <Link href="/assets">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">Browse Assets</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="transition-all hover:shadow-lg hover:scale-[1.01] duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2 flex items-center gap-2 font-sans text-xl">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                        {transaction.asset_name || `Asset #${transaction.asset_id}`}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Buyer: {transaction.buyer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(transaction.timestamp)}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant="secondary" className="gap-1">
                        <Hash className="h-3 w-3" />
                        {transaction.quantity} tokens
                      </Badge>
                      {transaction.total_price && (
                        <div className="flex items-center gap-1 justify-end">
                          <DollarSign className="h-5 w-5 text-indigo-600" />
                          <span className="font-sans text-2xl font-bold text-indigo-600">
                            {transaction.total_price.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {transaction.price && (
                        <div className="text-sm text-muted-foreground">
                          ${transaction.price.toLocaleString()} per token
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
