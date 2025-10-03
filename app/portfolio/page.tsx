"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, DollarSign, Building2, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Transaction {
  id: number
  asset_name: string
  quantity: number
  price: number
  buyer_name: string
  created_at: string
}

interface PortfolioAsset {
  assetName: string
  totalTokens: number
  totalInvested: number
  currentValue: number
  profitLoss: number
  profitLossPercent: number
}

export default function PortfolioPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions")
      const data = await response.json()
      setTransactions(data)
      calculatePortfolio(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePortfolio = (txns: Transaction[]) => {
    const assetMap = new Map<string, PortfolioAsset>()

    txns.forEach((txn) => {
      const existing = assetMap.get(txn.asset_name)
      const invested = txn.price * txn.quantity
      // Simulate current value with slight increase
      const currentValue = invested * (1 + Math.random() * 0.1)

      if (existing) {
        existing.totalTokens += txn.quantity
        existing.totalInvested += invested
        existing.currentValue += currentValue
      } else {
        assetMap.set(txn.asset_name, {
          assetName: txn.asset_name,
          totalTokens: txn.quantity,
          totalInvested: invested,
          currentValue: currentValue,
          profitLoss: 0,
          profitLossPercent: 0,
        })
      }
    })

    // Calculate profit/loss
    const portfolioArray = Array.from(assetMap.values()).map((asset) => ({
      ...asset,
      profitLoss: asset.currentValue - asset.totalInvested,
      profitLossPercent: ((asset.currentValue - asset.totalInvested) / asset.totalInvested) * 100,
    }))

    setPortfolio(portfolioArray)
  }

  const totalInvested = portfolio.reduce((sum, asset) => sum + asset.totalInvested, 0)
  const totalCurrentValue = portfolio.reduce((sum, asset) => sum + asset.currentValue, 0)
  const totalProfitLoss = totalCurrentValue - totalInvested
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0

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
              <Button variant="default">Portfolio</Button>
            </Link>
            <Link href="/transactions">
              <Button variant="ghost">Transactions</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="mb-2 font-sans text-4xl font-bold flex items-center gap-3">
            <Wallet className="h-10 w-10 text-indigo-600" />
            My Portfolio
          </h1>
          <p className="text-lg text-muted-foreground">Track your tokenized asset investments and performance</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 w-3/4 rounded bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : portfolio.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-sans text-xl font-bold mb-2">No Investments Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start building your portfolio by investing in tokenized assets
              </p>
              <Link href="/assets">
                <Button className="bg-indigo-600 hover:bg-indigo-700">Browse Assets</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Portfolio Summary */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                <CardHeader>
                  <CardDescription className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Invested
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-sans text-3xl font-bold">${totalInvested.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                <CardHeader>
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Current Value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-sans text-3xl font-bold text-indigo-600">${totalCurrentValue.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card
                className={`border-${totalProfitLoss >= 0 ? "green" : "red"}-500/20 bg-gradient-to-br from-${totalProfitLoss >= 0 ? "green" : "red"}-500/5 to-${totalProfitLoss >= 0 ? "emerald" : "orange"}-500/5`}
              >
                <CardHeader>
                  <CardDescription className="flex items-center gap-2">
                    {totalProfitLoss >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    Total Profit/Loss
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`font-sans text-3xl font-bold ${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {totalProfitLoss >= 0 ? "+" : ""}${totalProfitLoss.toFixed(2)}
                  </div>
                  <div className={`text-sm ${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {totalProfitLoss >= 0 ? "+" : ""}
                    {totalProfitLossPercent.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Assets */}
            <div className="space-y-4">
              <h2 className="font-sans text-2xl font-bold">Your Assets</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {portfolio.map((asset, index) => (
                  <Card key={index} className="transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="font-sans text-xl flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-indigo-600" />
                            {asset.assetName}
                          </CardTitle>
                          <CardDescription className="mt-1">{asset.totalTokens} tokens owned</CardDescription>
                        </div>
                        <Badge variant={asset.profitLoss >= 0 ? "default" : "destructive"} className="gap-1">
                          {asset.profitLoss >= 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {asset.profitLoss >= 0 ? "+" : ""}
                          {asset.profitLossPercent.toFixed(2)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Invested</div>
                          <div className="font-sans text-lg font-bold">${asset.totalInvested.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Current Value</div>
                          <div className="font-sans text-lg font-bold text-indigo-600">
                            ${asset.currentValue.toFixed(2)}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm text-muted-foreground mb-1">Profit/Loss</div>
                          <div
                            className={`font-sans text-lg font-bold ${asset.profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {asset.profitLoss >= 0 ? "+" : ""}${asset.profitLoss.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
