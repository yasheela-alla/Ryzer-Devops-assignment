import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, TrendingUp, Zap, BarChart3, Wallet, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-500">
              <span className="font-sans text-xl font-bold text-white">R</span>
            </div>
            <span className="font-sans text-xl font-bold">Ryzer</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/assets">
              <Button variant="ghost">Assets</Button>
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

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 animate-pulse">
            <Zap className="h-4 w-4" />
            <span>Regulated Sandbox by Qatar Financial Centre (QFC)</span>
          </div>

          <h1 className="mb-6 font-sans text-5xl font-bold leading-tight text-balance md:text-6xl lg:text-7xl">
            Invest in What's{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Real & Visible
            </span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground text-balance md:text-xl">
            Buy and sell real estate as easily as trading stocks. Starting at $500, with instant liquidity. Finally, an
            exchange for Real Estate.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/assets">
              <Button size="lg" className="group gap-2 bg-indigo-600 hover:bg-indigo-700">
                Explore Assets
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Wallet className="h-4 w-4" />
                Track Portfolio
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8">
            <div className="space-y-1">
              <div className="font-sans text-3xl font-bold text-indigo-600">18-20%</div>
              <div className="text-sm text-muted-foreground">Projected ROI/Year</div>
            </div>
            <div className="space-y-1">
              <div className="font-sans text-3xl font-bold text-indigo-600">$500</div>
              <div className="text-sm text-muted-foreground">Minimum Investment</div>
            </div>
            <div className="space-y-1">
              <div className="font-sans text-3xl font-bold text-indigo-600">24/7</div>
              <div className="text-sm text-muted-foreground">Instant Liquidity</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-24 grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:scale-105 duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mb-2 font-sans text-xl font-bold">Secure & Transparent</h3>
            <p className="text-muted-foreground">
              All transactions are recorded on the blockchain, ensuring complete transparency and security.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:scale-105 duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mb-2 font-sans text-xl font-bold">Monthly Rental Income</h3>
            <p className="text-muted-foreground">
              Earn passive income with hassle-free monthly rental payouts from tokenized properties.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:scale-105 duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mb-2 font-sans text-xl font-bold">Instant Trading</h3>
            <p className="text-muted-foreground">
              Trade tokens easily in our P2P secondary trading platform with instant settlement.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:scale-105 duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mb-2 font-sans text-xl font-bold">Real-Time Analytics</h3>
            <p className="text-muted-foreground">
              Track your portfolio performance with live price updates and detailed analytics.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:scale-105 duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
              <Wallet className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mb-2 font-sans text-xl font-bold">Portfolio Management</h3>
            <p className="text-muted-foreground">
              Manage all your tokenized assets in one place with comprehensive portfolio tracking.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:scale-105 duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
              <Globe className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mb-2 font-sans text-xl font-bold">Global Access</h3>
            <p className="text-muted-foreground">
              Invest in premium properties worldwide from anywhere, breaking geographical barriers.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-sans text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Start investing in real estate in 4 simple steps</p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="relative">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-2xl">
                1
              </div>
              <h3 className="mb-2 font-sans text-xl font-bold">Browse</h3>
              <p className="text-muted-foreground">
                Search and invest in our highly curated selection of long-term rental properties.
              </p>
            </div>

            <div className="relative">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-2xl">
                2
              </div>
              <h3 className="mb-2 font-sans text-xl font-bold">Buy</h3>
              <p className="text-muted-foreground">
                Invest in vetted opportunities with full due diligence starting at just $500.
              </p>
            </div>

            <div className="relative">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-2xl">
                3
              </div>
              <h3 className="mb-2 font-sans text-xl font-bold">Earn</h3>
              <p className="text-muted-foreground">
                Sit back and earn consistent rental income from high-yield rental assets monthly.
              </p>
            </div>

            <div className="relative">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-2xl">
                4
              </div>
              <h3 className="mb-2 font-sans text-xl font-bold">Trade</h3>
              <p className="text-muted-foreground">
                Instantly trade, stake tokens, and boost APY—exit whenever needed with full liquidity.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-500">
                  <span className="font-sans text-xl font-bold text-white">R</span>
                </div>
                <span className="font-sans text-xl font-bold">Ryzer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tokenized real-world assets platform. Invest in what's real and visible.
              </p>
            </div>

            <div>
              <h4 className="font-sans font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/assets" className="hover:text-foreground transition-colors">
                    Browse Assets
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="hover:text-foreground transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/transactions" className="hover:text-foreground transition-colors">
                    Transactions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-sans font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://ryzer.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    About Ryzer
                  </a>
                </li>
                <li>
                  <a
                    href="https://ryzer.app/#how"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="https://ryzer.app/#faq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-sans font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Regulated by QFC</li>
                <li>Blockchain Secured</li>
                <li>Transparent Trading</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Ryzer Tokenized Assets. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">
              Developed by <span className="font-bold text-indigo-600">Yasheela Alla</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
