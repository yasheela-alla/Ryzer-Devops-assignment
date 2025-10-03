# Ryzer Tokenized Assets – Setup Guide

## Prerequisites
- Node.js 18+
- Git
- VS Code
- AWS account (for deployment)


## 1. Get the Project

### Option A: Download ZIP
- Extract the ZIP
- Open the folder in VS Code

### Option B: Clone with Git
```bash
git clone <your-repo-url>
cd ryzer-tokenized-assets
````


## 2. Install Dependencies

```bash
rm -rf node_modules package-lock.json   # clean install
npm install
```


## 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
(Uses 3001/3002 if 3000 is busy)


## 4. Test Production Build

```bash
npm run build
npm start
```

## 5. Deploy to AWS

### Option A: Static Export (S3 Hosting)

1. In `next.config.mjs`:

   ```javascript
   const nextConfig = {
     output: 'export',
     images: { unoptimized: true },
   }
   export default nextConfig
   ```
2. Build static files:

   ```bash
   npm run build
   ```
3. Upload the `out/` folder to an S3 bucket (enable static hosting).

### Option B: Full Next.js (AWS Amplify)

1. Push code to GitHub
2. Connect repo to AWS Amplify
3. Amplify auto-detects Next.js and deploys


## Troubleshooting

* **Port in use:**

  ```bash
  npx kill-port 3000
  ```

* **Modules missing:**

  ```bash
  rm -rf node_modules package-lock.json && npm install
  ```

* **Build errors:**
  Ensure Node.js 18+

  ```bash
  node --version
  ```

## Project Structure

```
app/
  page.tsx              # Homepage
  assets/page.tsx       # Marketplace
  portfolio/page.tsx    # Portfolio
  transactions/page.tsx # Transactions
  api/                  # API routes
  layout.tsx            # Root layout
components/             # UI components
lib/                    # Utilities
public/                 # Static assets
```

