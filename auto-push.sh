#!/bin/bash

# Get the current date and time
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Add all changes
git add .

# Commit with a timestamp
git commit -m "Auto-commit: $TIMESTAMP"

# Push to remote
git push origin main

echo "Changes pushed successfully at $TIMESTAMP" 