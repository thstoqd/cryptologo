# Deployment Guide - Cloudflare Pages

This guide will help you deploy Cryptologo to Cloudflare Pages with your custom domain `cryptologo.org`.

## Prerequisites

1. ✅ GitHub repository: `https://github.com/thstoqd/cryptologo.git`
2. ✅ Domain purchased: `cryptologo.org` (from Spaceship)
3. ✅ Cloudflare account (free tier is sufficient)

## Step 1: Push Code to GitHub

Make sure all your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Cloudflare Pages deployment"
git push origin main
```

## Step 2: Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Click **Connect to Git**
4. Select **GitHub** and authorize Cloudflare
5. Select repository: `thstoqd/cryptologo`
6. Click **Begin setup**

## Step 3: Configure Build Settings

Use these build settings:

- **Project name**: `cryptologo` (or any name you prefer)
- **Production branch**: `main`
- **Framework preset**: `Next.js (Static HTML Export)`
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Root directory**: `/` (leave empty)
- **Environment variables**: 
  - `NEXT_PUBLIC_SITE_URL`: `https://cryptologo.org`

## Step 4: Deploy

1. Click **Save and Deploy**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your site will be available at: `https://cryptologo.pages.dev`

## Step 5: Connect Custom Domain

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `cryptologo.org`
4. Cloudflare will automatically configure DNS records

### DNS Configuration in Spaceship

If Cloudflare doesn't automatically configure DNS, you may need to update DNS records in Spaceship:

1. Go to your Spaceship domain management
2. Update nameservers to Cloudflare's nameservers (provided in Cloudflare dashboard)
   - Or add CNAME record:
     - **Type**: CNAME
     - **Name**: `@` (or `cryptologo.org`)
     - **Value**: `cryptologo.pages.dev`

## Step 6: SSL/TLS Configuration

Cloudflare automatically provides free SSL certificates. Ensure:

1. Go to **SSL/TLS** in Cloudflare dashboard
2. Set encryption mode to **Full** or **Full (strict)**
3. SSL certificate will be automatically provisioned (may take a few minutes)

## Step 7: Verify Deployment

1. Visit `https://cryptologo.org`
2. Check that all icons load correctly
3. Test search functionality
4. Test icon detail pages
5. Verify downloads work

## Environment Variables

If you need to change the site URL later:

1. Go to Cloudflare Pages → Your project → **Settings** → **Environment variables**
2. Add/update: `NEXT_PUBLIC_SITE_URL` = `https://cryptologo.org`
3. Redeploy the site

## Automatic Deployments

Cloudflare Pages automatically deploys when you push to the `main` branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

A new deployment will start automatically.

## Troubleshooting

### Build Fails

- Check build logs in Cloudflare Pages dashboard
- Ensure `package.json` has all dependencies
- Verify Node.js version (should be 18+)

### Domain Not Working

- Wait 24-48 hours for DNS propagation
- Check DNS records in Cloudflare dashboard
- Verify SSL certificate is active

### Icons Not Loading

- Ensure all icon files are in `public/icons/` directory
- Check file paths in `data/icons-metadata.json`
- Verify files are committed to GitHub

## Cloudflare R2 (Optional - For Future Icon Storage)

If you want to store icons in Cloudflare R2 instead of the repository:

1. Create an R2 bucket in Cloudflare dashboard
2. Upload icons to R2
3. Configure R2 public access
4. Update icon paths in `data/icons-metadata.json` to use R2 URLs

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

