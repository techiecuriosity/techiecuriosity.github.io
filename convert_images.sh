#!/bin/bash

# Convert icon.svg to PNG in different sizes
magick convert -background none -density 300 images/icon.svg -resize 192x192 images/icon-192x192.png
magick convert -background none -density 300 images/icon.svg -resize 512x512 images/icon-512x512.png

# Convert screenshot1.svg to PNG with improved settings
magick convert -background none -density 300 images/screenshot1.svg -resize 1280x720 images/screenshot1.png

echo "Images converted successfully!" 