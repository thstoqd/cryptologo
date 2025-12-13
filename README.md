# Cryptologo

Free cryptocurrency icon library - Download SVG and PNG icons for free.

## Getting Started

Install dependencies:

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `/app` - Next.js app directory
- `/components` - React components
- `/public/icons` - Placeholder icons (SVG and PNG)
- `/data` - Metadata JSON files
- `/lib` - Utility functions

## Icon Upload

Icons are uploaded manually to Cloudflare R2 via Dashboard:
- SVG files: `svg/{category}/{icon-name}.svg`
- PNG files: `png/{category}/{icon-name}/{size}.png`

After uploading, update `data/icons-metadata.json` and commit.

