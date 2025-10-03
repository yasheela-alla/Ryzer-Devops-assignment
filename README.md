# Ryzer Tokenized Assets Platform

A modern web application for trading tokenized real estate and assets.  
Built with **Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI** to demonstrate full-stack development and production readiness.  

**Developed by Yasheela Alla for [ryzer.app](https://www.ryzer.app)**

---

## 🚀 Quick Start (Local Setup)

1. **Open Project in VS Code**
   - Extract the ZIP → Open folder in VS Code

2. **Install Dependencies**
   ```bash
   npm install

3. **Run Development Server**

   ```bash
   npm run dev
   ```

   Visit: [http://localhost:3000](http://localhost:3000)

4. **Build for Production**

   ```bash
   npm run build
   ```

   Outputs static files in the `out/` folder (ready for AWS S3).


## 🌐 Deployment Options

* **AWS S3 (Recommended):**

  ```bash
  aws s3 sync out/ s3://YOUR-BUCKET-NAME --delete
  ```
* **Vercel (1-click)**
* **AWS Amplify (Next.js auto-detect)**

See [AWS-DEPLOYMENT.md](./AWS-DEPLOYMENT.md) for details.


## 🏗️ Features

### Core Functionality

* Asset marketplace with 6+ tokenized properties
* Search, filter, and sort by location, price, ROI
* Real-time price updates (every 5s)
* Token purchase flow with validation & success animations
* Portfolio dashboard with profit/loss tracking
* Transaction history with search and audit trail
* ROI calculator with monthly & annual projections

## 📂 Project Structure

```
app/
  api/              # REST API routes
  assets/           # Marketplace page
  portfolio/        # Portfolio dashboard
  transactions/     # Transaction history
components/
  ui/               # Shadcn UI
  buy-asset-dialog  # Purchase modal
  roi-calculator    # ROI calculator
scripts/
  seed.sql          # PostgreSQL schema
```

## 📡 API Endpoints

* **GET /api/assets** → List all assets
* **POST /api/buy** → Process token purchase
* **GET /api/transactions** → Transaction history

Example:

```json
{
  "assetId": 1,
  "quantity": 5,
  "buyerName": "Yasheela Alla"
}
```

---

## 🎯 Demo Flow

1. **Homepage** → Key stats, animations, “How It Works”
2. **Assets Page** → ROI calculator, real-time updates, search/filter/sort
3. **Purchase Flow** → Buy tokens, validation, success animation
4. **Portfolio** → Profit/loss tracking, empty state handling
5. **Transactions** → Searchable, detailed transaction history


## ⚙️ Troubleshooting

* **Port in Use:**

  ```bash
  npx kill-port 3000
  ```
* **Node Modules Errors:**

  ```bash
  rm -rf node_modules package-lock.json && npm install
  ```
* **Build Errors:** Ensure **Node.js 18+**


*"Invest in What's Real & Visible"*

