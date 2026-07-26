# 🚀 GitHub Pages PWA Deployment Guide

This guide explains how to deploy the **Mental Health PWA** to GitHub Pages using **GitHub Actions**. Once configured, you can collaborate with me to make changes, download the updated files, push them to your repository, and let GitHub Actions deploy them live automatically.

---

## 🛠️ The Expected Iterative Workflow

1. **Request Changes**: Tell me what features, designs, or modifications you want to make.
2. **Implementation**: I will write the precise, production-ready code in this workspace.
3. **Download ZIP**: Download the complete, updated project ZIP containing the latest React/PWA code.
4. **Push to GitHub**: Commit and push the files to your `pwa` branch.
5. **Auto-Deploy**: GitHub Actions compiles and publishes your updated application to the web in under 2 minutes!

---

## 📋 Step-by-Step GitHub Setup

### Step 1: Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign in.
2. Click **New** to create a new repository.
3. Choose a name (e.g., `mental-health-toolkit`).
4. Keep it **Public** (required for free GitHub Pages hosting) and do **not** initialize it with a README, `.gitignore`, or license.
5. Click **Create repository**.

### Step 2: Initialize Git and Push Code
If you download the project ZIP, extract it on your computer. Open your terminal in the extracted folder and run:

```bash
# Add your new remote repository URL (replace with your actual URL)
git remote add origin https://github.com/your-username/mental-health-toolkit.git

# Make sure you are on the PWA branch
git checkout pwa

# Push the code to GitHub
git push -u origin pwa
```

### Step 3: Enable GitHub Actions for Pages
To allow the pre-configured workflow file (`.github/workflows/deploy-github-pages.yml`) to deploy your site:

1. Open your repository on GitHub.
2. Go to **Settings** (top tabs) ➡️ **Pages** (left sidebar).
3. Under **Build and deployment** ➡️ **Source**, select **GitHub Actions** from the dropdown menu (instead of "Deploy from a branch").
4. Under **Actions** ➡️ **General** (left sidebar), scroll down to **Workflow permissions**, make sure **Read and write permissions** is selected, and click **Save**.

---

## ⚡ How the Automated Deployment Works

Your repository already contains a preconfigured GitHub Action at `.github/workflows/deploy-github-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - pwa # Automatically deploy when pushing to the pwa branch

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Whenever you push a change to the `pwa` branch, GitHub Actions will:
1. Boot a secure Ubuntu build machine.
2. Check out your code and cache dependencies.
3. Run `npm run build` to compile the TypeScript/React application into high-performance static PWA assets inside the `./dist` folder.
4. Upload `./dist` as a GitHub Pages artifact.
5. Deploy it securely to your live domain (e.g., `https://your-username.github.io/mental-health-toolkit/`).

---

## 📲 Installing Your PWA on Your Phone/Desktop
Once GitHub Pages finishes deployment, visit your site on any browser:
- **On Safari (iOS)**: Tap the **Share** button ➡️ scroll down and select **Add to Home Screen**.
- **On Chrome (Android)**: Tap the three dots menu in the top right ➡️ select **Install app** or **Add to Home Screen**.
- **On Chrome/Edge (Desktop)**: Click the **Install** icon on the right side of the URL address bar.

The application will run inside a standalone native-like window, support offline use, and launch directly from your home screen!
