#!/bin/bash

# Extract current version
current_version=$(sed -n 's/.*"version": "\(.*\)".*/\1/p' package.json)

# Prompt for new version
read -p "Enter the new version number (current: $current_version): " version

# Validate version input
if [[ -z "$version" || ! "$version" =~ ^[0-9]+(\.[0-9]+)*$ ]]; then
  echo "Error: Invalid version number. It must contain only digits and dots."
  exit 1
fi

# Update package.json
sed -i '' -e "s/\"version\": \".*\"/\"version\": \"$version\"/" package.json

# Update manifest.json
sed -i '' -e "s/\"version\": \".*\"/\"version\": \"$version\"/" build/manifest.json

# Commit changes
git add package.json build/manifest.json
git commit -m "Release version $version"
git tag "v$version"