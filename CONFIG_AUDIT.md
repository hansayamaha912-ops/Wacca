// Check for duplicate vite config files and Shopify remnants
// The following files should be verified and cleaned:
// 1. vite.config.js / vite.config.ts (keep only one, remove Shopify presets)
// 2. shopify.config.json (DELETE)
// 3. hydrogen.config.js (DELETE)
// 4. oxygen.config.ts (DELETE)
// 5. package.json (verify build scripts and remove @shopify/oxygen packages)
// 6. vercel.json (ensure Remix framework preset is correct)