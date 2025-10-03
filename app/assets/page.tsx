"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, MapPin, TrendingUp, Search, Filter, ArrowUpDown } from "lucide-react"
import { BuyAssetDialog } from "@/components/buy-asset-dialog"
import { ROICalculator } from "@/components/roi-calculator"

// Asset type definition for TypeScript
interface Asset {
  id: number
  name: string
  price: number
  supply: number
  location?: string
  type?: string
  roi?: number
  priceChange?: number
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterLocation, setFilterLocation] = useState("all")

  // Fetch assets from backend API on component mount
  useEffect(() => {
    fetchAssets()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) =>
        prevAssets.map((asset) => ({
          ...asset,
          priceChange: (Math.random() - 0.5) * 2, // Random price change between -1% and +1%
        })),
      )
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let result = [...assets]

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.location?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Location filter
    if (filterLocation !== "all") {
      result = result.filter((asset) => asset.location === filterLocation)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "roi":
          return (b.roi || 0) - (a.roi || 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredAssets(result)
  }, [assets, searchQuery, sortBy, filterLocation])

  const fetchAssets = async () => {
    try {
      const response = await fetch("/api/assets")
      const data = await response.json()
      setAssets(data)
      setFilteredAssets(data)
    } catch (error) {
      console.error("Error fetching assets:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle successful purchase - refresh assets list
  const handlePurchaseSuccess = () => {
    fetchAssets()
    setSelectedAsset(null)
  }

  // Get unique locations for filter
  const locations = Array.from(new Set(assets.map((a) => a.location).filter(Boolean)))

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
              <Button variant="default">Assets</Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="ghost">Portfolio</Button>
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
          <h1 className="mb-2 font-sans text-4xl font-bold">Available Assets</h1>
          <p className="text-lg text-muted-foreground">Browse and invest in tokenized real estate assets</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterLocation} onValueChange={setFilterLocation}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location!}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="roi">ROI (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ROICalculator />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No assets found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="group transition-all hover:shadow-lg hover:scale-105 duration-300">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <Badge variant="secondary" className="gap-1">
                      <Building2 className="h-3 w-3" />
                      Real Estate
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {asset.supply} available
                    </Badge>
                  </div>
                  <CardTitle className="font-sans text-xl">{asset.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {asset.location || "India"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans text-3xl font-bold">${asset.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">per token</span>
                      {asset.priceChange !== undefined && (
                        <span
                          className={`text-xs font-medium ${asset.priceChange >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {asset.priceChange >= 0 ? "+" : ""}
                          {asset.priceChange.toFixed(2)}%
                        </span>
                      )}
                    </div>
                    {asset.roi && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Projected ROI:</span>
                        <span className="font-bold text-green-600">{asset.roi}% / year</span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">Fractional ownership of premium real estate</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setSelectedAsset(asset)}
                    disabled={asset.supply === 0}
                  >
                    {asset.supply === 0 ? "Sold Out" : "Buy Tokens"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Buy Asset Dialog */}
      {selectedAsset && (
        <BuyAssetDialog
          asset={selectedAsset}
          open={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  )
}
