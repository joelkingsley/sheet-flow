#!/bin/bash
# EAS Build hook to set up npm authentication for GitHub Packages

echo "=== Setting up npm authentication for GitHub Packages ==="

# Check if GITHUB_TOKEN is available
if [ -z "$GITHUB_TOKEN" ]; then
    echo "ERROR: GITHUB_TOKEN environment variable is not set"
    exit 1
fi

echo "GITHUB_TOKEN is available (length: ${#GITHUB_TOKEN})"

# Create .npmrc with the actual token value
echo "Creating .npmrc with GitHub authentication..."
cat > .npmrc << EOF
@joelkingsley:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF

echo "Contents of .npmrc:"
cat .npmrc

echo "=== npm authentication configured successfully ==="
