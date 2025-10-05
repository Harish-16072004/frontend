# QR Codes Setup Guide

## Overview
The registration page requires 4 QR code images for different payment amounts.

## Required QR Code Images

### 1. General Registration QR Code
- **Filename:** `qr-general-299.png`
- **Location:** `frontend/public/`
- **Amount:** ₹299
- **Purpose:** For general registration only

### 2. Workshop Only QR Code
- **Filename:** `qr-workshop-199.png`
- **Location:** `frontend/public/`
- **Amount:** ₹199
- **Purpose:** For workshop registration only

### 3. Both (General + Workshop) QR Code
- **Filename:** `qr-both-499.png`
- **Location:** `frontend/public/`
- **Amount:** ₹499
- **Purpose:** For combined registration

### 4. Dummy/Placeholder QR Code
- **Filename:** `qr-dummy.png`
- **Location:** `frontend/public/`
- **Purpose:** Shown before user selects registration type
- **Note:** Use any placeholder image or text saying "Select registration type"

## Steps to Add QR Codes

### Option 1: Generate QR Codes Online
1. Go to a QR code generator (e.g., qr-code-generator.com)
2. Enter your UPI payment details or payment link
3. Generate QR code for each amount (₹299, ₹199, ₹499)
4. Download as PNG images
5. Rename files as specified above
6. Place all files in `frontend/public/` directory

### Option 2: Use Physical QR Codes
1. Take clear photos of your existing QR codes
2. Crop and edit to show only the QR code
3. Save as PNG images
4. Rename files as specified above
5. Place all files in `frontend/public/` directory

## Image Requirements
- **Format:** PNG (recommended) or JPG
- **Recommended Size:** 300x300 pixels or larger
- **Quality:** High resolution, clear and scannable
- **Background:** White or transparent preferred

## File Placement
```
frontend/
├── public/
│   ├── qr-general-299.png    ← General registration QR
│   ├── qr-workshop-199.png   ← Workshop only QR
│   ├── qr-both-499.png       ← Both (combo) QR
│   └── qr-dummy.png          ← Placeholder image
```

## Current Behavior
- Before adding images: Placeholder images from placeholder.com will be shown
- After adding images: Your actual QR codes will be displayed

## Testing
1. Start the frontend server
2. Go to registration page
3. Click each registration type button
4. Verify correct QR code appears for each selection
5. Test scanning QR codes with phone to ensure they work

## Important Notes
- Keep QR code images clear and high quality
- Test QR codes before deploying
- Backup original QR code images
- Update QR codes if payment details change
- All images should be named exactly as specified (case-sensitive)

## Fallback
If an image fails to load, a gray placeholder with text will be shown. Make sure:
1. File names match exactly
2. Files are in the correct directory
3. Images are not corrupted
4. File permissions are correct
