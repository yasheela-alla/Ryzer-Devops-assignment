"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, User, Hash, DollarSign, TrendingUp, CheckCircle2 } from "lucide-react"

interface Asset {
  id: number
  name: string
  price: number
  supply: number
  roi?: number
}

interface BuyAssetDialogProps {
  asset: Asset
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function BuyAssetDialog({ asset, open, onClose, onSuccess }: BuyAssetDialogProps) {
  const [buyerName, setBuyerName] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false) // Added success state for animation

  // Calculate total price based on quantity
  const totalPrice = asset.price * quantity
  const projectedAnnualIncome = asset.roi ? totalPrice * (asset.roi / 100) : 0
  const projectedMonthlyIncome = projectedAnnualIncome / 12

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!buyerName.trim()) {
      setError("Please enter your name")
      return
    }

    if (quantity < 1 || quantity > asset.supply) {
      setError(`Quantity must be between 1 and ${asset.supply}`)
      return
    }

    setLoading(true)

    try {
      // Send purchase request to backend
      const response = await fetch("/api/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetId: asset.id,
          quantity,
          buyerName: buyerName.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Purchase failed")
      }

      setSuccess(true)
      setTimeout(() => {
        setBuyerName("")
        setQuantity(1)
        setSuccess(false)
        onSuccess()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        {success ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 animate-pulse">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="font-sans text-2xl font-bold text-green-600 mb-2">Purchase Successful!</h3>
            <p className="text-muted-foreground">Your tokens have been added to your portfolio</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-sans text-2xl">
                <Building2 className="h-6 w-6 text-indigo-600" />
                Purchase Tokens
              </DialogTitle>
              <DialogDescription>Buy fractional ownership tokens for {asset.name}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6 py-4">
                {/* Asset Info */}
                <div className="rounded-lg border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Asset</span>
                    <Badge variant="secondary">{asset.supply} available</Badge>
                  </div>
                  <div className="font-sans text-xl font-bold">{asset.name}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">${asset.price.toLocaleString()} per token</span>
                    {asset.roi && (
                      <Badge variant="outline" className="gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {asset.roi}% ROI
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Buyer Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="buyerName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Your Name
                  </Label>
                  <Input
                    id="buyerName"
                    placeholder="Enter your full name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={asset.supply}
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">Maximum: {asset.supply} tokens available</p>
                </div>

                {asset.roi && (
                  <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Projected Rental Income</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Monthly</div>
                        <div className="font-sans text-lg font-bold text-green-600">
                          ${projectedMonthlyIncome.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Annually</div>
                        <div className="font-sans text-lg font-bold text-green-600">
                          ${projectedAnnualIncome.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Price Display */}
                <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="h-4 w-4" />
                      Total Investment
                    </span>
                    <span className="font-sans text-3xl font-bold text-indigo-600">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                  {loading ? "Processing..." : "Confirm Purchase"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
