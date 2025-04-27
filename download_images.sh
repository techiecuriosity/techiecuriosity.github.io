#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p images

# Download and optimize Vata image
curl -L "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop" -o images/vata-dosha.png
convert images/vata-dosha.png -resize 800x600 -quality 85 images/vata-dosha.png

# Download and optimize Pitta image
curl -L "https://images.unsplash.com/photo-1549937915-3dd443a3583f?w=800&h=600&fit=crop" -o images/pitta-dosha.png
convert images/pitta-dosha.png -resize 800x600 -quality 85 images/pitta-dosha.png

# Download and optimize Kapha image
curl -L "https://images.unsplash.com/photo-1546387903-6d82d96ccca6?w=800&h=600&fit=crop" -o images/kapha-dosha.png
convert images/kapha-dosha.png -resize 800x600 -quality 85 images/kapha-dosha.png

# Create thumbnail versions
convert images/vata-dosha.png -resize 300x225 -quality 85 images/vata-dosha-thumb.png
convert images/pitta-dosha.png -resize 300x225 -quality 85 images/pitta-dosha-thumb.png
convert images/kapha-dosha.png -resize 300x225 -quality 85 images/kapha-dosha-thumb.png

echo "Images downloaded and optimized successfully!" 