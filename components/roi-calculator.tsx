"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingUp } from "lucide-react"

export function ROICalculator() {
  const [investment, setInvestment] = useState(5000)
  const [roi, setRoi] = useState(18)
  const [years, setYears] = useState(5)

  // Calculate returns
  const monthlyIncome = (investment * (roi / 100)) / 12
  const yearlyIncome = investment * (roi / 100)
  const totalReturn = investment * Math.pow(1 + roi / 100, years)
  const totalProfit = totalReturn - investment

  return (
    <Card className="mb-8 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-sans text-2xl">
          <Calculator className="h-6 w-6 text-indigo-600" />
          ROI Calculator
        </CardTitle>
        <CardDescription>Calculate your potential returns from tokenized real estate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="investment">Investment Amount ($)</Label>
            <Input
              id="investment"
              type="number"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value) || 0)}
              min="500"
              step="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roi">Expected ROI (%/year)</Label>
            <Input
              id="roi"
              type="number"
              value={roi}
              onChange={(e) => setRoi(Number(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years">Investment Period (years)</Label>
            <Input
              id="years"
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value) || 0)}
              min="1"
              max="30"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground mb-1">Monthly Income</div>
            <div className="font-sans text-2xl font-bold text-green-600">${monthlyIncome.toFixed(2)}</div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground mb-1">Yearly Income</div>
            <div className="font-sans text-2xl font-bold text-green-600">${yearlyIncome.toFixed(2)}</div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Return</div>
            <div className="font-sans text-2xl font-bold text-indigo-600">${totalReturn.toFixed(2)}</div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Total Profit
            </div>
            <div className="font-sans text-2xl font-bold text-indigo-600">${totalProfit.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
