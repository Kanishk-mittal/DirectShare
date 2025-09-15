#!/bin/bash
set -e  # exit immediately on error

# -------------------------------
# Step 1: Ensure latest main
# -------------------------------
echo "Fetching latest main..."
git checkout main
git pull origin main

# -------------------------------
# Step 2: Switch to gh-pages (create/reset if needed)
# -------------------------------
if git show-ref --quiet refs/heads/gh-pages; then
    echo "Switching to gh-pages branch..."
    git checkout gh-pages
    git reset --hard main        # make it same as main
else
    echo "Creating orphan gh-pages branch..."
    git checkout --orphan gh-pages
    git reset --hard main
fi

# -------------------------------
# Step 3: Build project
# -------------------------------
echo "Building project..."
npm install
npm run build

# -------------------------------
# Step 4: Remove everything except .git and dist
# -------------------------------
echo "Cleaning branch..."
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name 'dist' -exec rm -rf {} +

# -------------------------------
# Step 5: Move dist/* to root
# -------------------------------
echo "Moving build output..."
shopt -s dotglob  # include hidden files
mv dist/* .
shopt -u dotglob

# -------------------------------
# Step 6: Remove empty dist folder
# -------------------------------
rm -rf dist

# -------------------------------
# Step 7: Add .nojekyll (to prevent GitHub Pages from ignoring _folders)
# -------------------------------
echo "Creating .nojekyll..."
touch .nojekyll

# -------------------------------
# Step 8: Commit changes
# -------------------------------
echo "Committing changes..."
git add -A
git commit -m "Deploy to GitHub Pages"

# -------------------------------
# Step 9: Push to GitHub
# -------------------------------
echo "Pushing to GitHub..."
git push -u origin gh-pages --force

# -------------------------------
# Step 10: Done moving back to main
# -------------------------------
echo "Switching back to main branch..."
git checkout main

echo "✅ Deployment complete!"
