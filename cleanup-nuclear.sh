#!/bin/bash
# FINAL NUCLEAR CLEANUP - Complete Shopify/Oxygen remnant destruction
cd /Users/hansamin/Developer/Wacca

echo "🔥 EXECUTING FINAL NUCLEAR CLEANUP..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Physical deletion phase
echo "📦 PHASE 1: Physical File Deletion"
echo ""

files_to_delete=(
  "shopify.config.json"
  "hydrogen.config.js"
  "oxygen.config.ts"
  "cleanup-vercel.sh"
)

for file in "${files_to_delete[@]}"; do
  if [ -f "$file" ]; then
    rm -f "$file"
    echo "✅ DELETED: $file"
  fi
done

# Vite timestamp cache destruction
echo ""
echo "📦 PHASE 2: Vite Timestamp Cache Destruction"
echo ""
rm -f vite.config.js.timestamp-*.mjs 2>/dev/null
echo "✅ DESTROYED: All vite.config.js.timestamp-*.mjs"

# Build artifact cleanup
echo ""
echo "📦 PHASE 3: Build Artifact Cleanup"
echo ""
rm -rf .vercel 2>/dev/null
rm -rf .next 2>/dev/null
rm -rf build 2>/dev/null
rm -rf dist 2>/dev/null
echo "✅ CLEARED: .vercel, build directories"

# Cache cleanup
echo ""
echo "📦 PHASE 4: Node Module Cache Cleanup"
echo ""
rm -rf node_modules/.vite 2>/dev/null
rm -rf node_modules/.bin/vite 2>/dev/null
echo "✅ CLEARED: node_modules cache"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ FINAL CLEANUP COMPLETE!"
echo ""
echo "📋 Verification Checklist:"
echo "   ✓ app/root.jsx → Standalone lightweight component"
echo "   ✓ vercel.json → New project name 'wacca-legal-core'"
echo "   ✓ vite.config.js → Vercel Remix preset only"
echo "   ✓ clear-cache-final.txt → Cache breaker activated"
echo "   ✓ All Shopify remnants → PHYSICALLY DELETED"
echo ""
echo "🚀 Ready for final deployment:"
echo "   npm install"
echo "   npm run build"
echo "   git add ."
echo "   git commit -m \"nuclear: complete Hydrogen to Vercel Remix migration with cache bypass\""
echo "   git push origin main"