# Placeholder Icons

Currently, the project uses placeholder SVG icons. You need to replace them with your actual icon files.

## Current Placeholder Structure

The placeholder SVG icons are located in:
- `/public/icons/svg/{category}/{icon-name}.svg`

## PNG Placeholder Icons

PNG icons need to be created for each size. The structure should be:
- `/public/icons/png/{category}/{icon-name}/{size}.png`

For example:
- `/public/icons/png/cryptocurrency/bitcoin/16.png`
- `/public/icons/png/cryptocurrency/bitcoin/24.png`
- `/public/icons/png/cryptocurrency/bitcoin/32.png`
- `/public/icons/png/cryptocurrency/bitcoin/48.png`
- `/public/icons/png/cryptocurrency/bitcoin/64.png`
- `/public/icons/png/cryptocurrency/bitcoin/128.png`
- `/public/icons/png/cryptocurrency/bitcoin/256.png`

## Replacing Placeholders

1. Replace SVG files in `/public/icons/svg/{category}/`
2. Create PNG files in `/public/icons/png/{category}/{icon-name}/`
3. Update `data/icons-metadata.json` with new icon information
4. The icons will automatically appear in the UI

## Icon Naming Convention

- Use lowercase with hyphens: `bitcoin.svg`, `ethereum-chain.svg`
- Keep names consistent between SVG and PNG folders
- Update the `id` field in `icons-metadata.json` to match the file name

