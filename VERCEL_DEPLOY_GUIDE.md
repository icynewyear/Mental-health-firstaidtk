# ⚡ Vercel PWA Deployment Guide

This guide explains how to import and deploy your **Mental Health PWA** to **Vercel** using your GitHub repository as the source of truth. Once set up, every time you push or commit changes to your repository, Vercel will build and deploy a live update automatically.

---

## 🚀 Why Deploy on Vercel?

Deploying on Vercel is extremely popular because:
- **Instant Imports**: 1-click connection to your GitHub repository.
- **Fast Global Edge CDN**: Incredible loading speed worldwide.
- **Preview Deployments**: Push a change to a feature branch, and Vercel automatically generates a temporary live preview link for you to check before merging!
- **Zero-Config Routing**: Handles client-side routes effortlessly (configured inside our custom `vercel.json` file).

---

## 🛠️ Step-by-Step Vercel Setup

### Step 1: Push Your Code to GitHub
Ensure your code is uploaded to GitHub on your preferred branch (e.g., `pwa` or `main`).

```bash
# Verify you are on your PWA branch
git checkout pwa

# Link your remote repository and push (if you haven't already)
git remote add origin https://github.com/your-username/mental-health-toolkit.git
git push -u origin pwa
```

### Step 2: Sign Up / Sign In on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in.
2. We highly recommend choosing **Continue with GitHub** to automatically link your repositories.

### Step 3: Import Your Repository
1. On the Vercel Dashboard, click the **Add New...** button in the top right and select **Project**.
2. Under "Import Git Repository", search for your repository name (e.g., `mental-health-toolkit`) and click **Import**.

### Step 4: Configure Project Settings
Vercel is smart and will automatically recognize that you are using **Vite**. Keep the default settings:
- **Framework Preset**: `Vite` (automatically detected)
- **Root Directory**: `./` (default)
- **Build and Output Settings**:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install` or `npm ci`
- **Environment Variables**: None required!

Click **Deploy**.

---

## ⚙️ How Vercel Handles Progressive Web Apps

We have preconfigured a professional `vercel.json` configuration file at the root of the project:

```json
{
  "version": 2,
  "cleanUrls": true,
  "routes": [
    {
      "src": "/sw.js",
      "headers": {
        "cache-control": "no-cache, no-store, must-revalidate"
      },
      "dest": "/sw.js"
    },
    {
      "src": "/manifest.json",
      "headers": {
        "cache-control": "no-cache, no-store, must-revalidate"
      },
      "dest": "/manifest.json"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Why this is critical for your PWA:
1. **Prevent Offline Stalling**: The Service Worker file (`sw.js`) and the manifest configuration (`manifest.json`) are configured with `no-cache` headers. This guarantees browsers can detect and fetch update scripts instantly when you deploy new versions, rather than loading stale, cached offline files.
2. **SPA Routing rewrite**: The `/(.*)` wildcard ensures that if you decide to add client-side routers later, deep-links (e.g., `yoursite.com/tools/breathing`) will resolve cleanly to `index.html` instead of hitting a 404 page.

---

## 📲 Installing Your Live PWA

Once Vercel gives you your production URL (e.g., `https://mental-health-toolkit.vercel.app`), visit it on your phone:
- **iPhone / iOS (Safari)**: Tap the share button ➡️ **Add to Home Screen**.
- **Android (Chrome)**: Tap the three dots menu ➡️ **Install app**.
- **Desktop (Chrome/Edge/Brave)**: Click the **Install** button in the top-right address bar.

The application runs in a standalone, distraction-free app window, works perfectly offline, and integrates directly with your system apps list!
