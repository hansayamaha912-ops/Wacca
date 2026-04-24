#!/bin/bash
cd /Users/hansamin/Developer/Wacca

# Initialize git repository
git init

# Add remote origin
git remote add origin https://github.com/hansayamaha912-ops/Wacca.git

# Set branch to main
git branch -M main

# Add all files, commit, and force push
git add .
git commit -m "chore: relocate project to local Developer dir to avoid iCloud sync issues & fix HeroScene component ref"
git push -u origin main --force

echo "✅ Git repository has been successfully initialized and pushed to GitHub!"