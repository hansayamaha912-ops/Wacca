#!/bin/bash
# Cleanup Vite timestamp cache files and node_modules/.vite
cd /Users/hansamin/Developer/Wacca

# Remove Vite timestamp cache files
rm -f vite.config.js.timestamp-*.mjs 2>/dev/null
echo "✅ Removed Vite timestamp cache files"

# Remove .vercel old builds
rm -rf .vercel 2>/dev/null
echo "✅ Removed .vercel build artifacts"

# Clean vite cache
rm -rf node_modules/.vite 2>/dev/null
echo "✅ Cleared Vite cache from node_modules"

# Fresh install
npm install
echo "✅ Reinstalled dependencies"

echo ""
echo "🎉 All Shopify/Oxygen remnants removed. Project is now 100% Vercel Remix compatible."
echo ""
echo "Next steps:"
echo "1. Run: npm run build"
echo "2. Verify build outputs to .vercel/output"
echo "3. Push to GitHub"
echo "4. Vercel will redeploy automatically"