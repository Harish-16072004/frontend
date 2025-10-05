# Temporary QR Code Placeholders

Since you don't have the actual QR code images yet, here's how to create temporary placeholder images for testing:

## Option 1: Use Online Placeholder Images (Temporary)

The Register component already has fallback placeholders that will show if images don't load.

## Option 2: Quick Placeholder Images

### Create Simple Text Images
1. Open any image editor (Paint, Photoshop, GIMP, or online tool like Canva)
2. Create 300x300 pixel images
3. Add text:
   - **qr-general-299.png**: "QR for ₹299\nGeneral Registration"
   - **qr-workshop-199.png**: "QR for ₹199\nWorkshop Only"
   - **qr-both-499.png**: "QR for ₹499\nBoth Registration"
   - **qr-dummy.png**: "Select Registration Type"
4. Save as PNG files
5. Place in `frontend/public/` folder

## Option 3: Generate Real QR Codes Now

### Using Free Online QR Generator (Recommended)
1. Go to https://www.qr-code-generator.com/
2. Select "UPI Payment" or "Website URL" type
3. For UPI:
   - Enter: `upi://pay?pa=shackles2025@acgcet&pn=SHACKLES2025&am=299&cu=INR`
   - Replace 299 with 199 or 499 for other amounts
4. Generate and download as PNG
5. Rename files appropriately
6. Place in `frontend/public/` folder

### UPI URLs for Each Amount:
```
General (₹299):
upi://pay?pa=YOUR_UPI_ID@bank&pn=SHACKLES2025&am=299&cu=INR

Workshop (₹199):
upi://pay?pa=YOUR_UPI_ID@bank&pn=SHACKLES2025&am=199&cu=INR

Both (₹499):
upi://pay?pa=YOUR_UPI_ID@bank&pn=SHACKLES2025&am=499&cu=INR
```

Replace `YOUR_UPI_ID@bank` with your actual UPI ID.

## Testing Without QR Codes

The system will work even without QR codes. The fallback will show:
- A gray placeholder with "QR Code" text
- Users can still upload payment screenshots
- The flow will complete normally

Just make sure to add real QR codes before production deployment!

## Quick Test Script

You can test the registration flow without QR codes:
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Go to registration page
4. Fill in all details
5. Select any registration type
6. You'll see placeholder image (that's okay for testing)
7. Upload any image as payment screenshot
8. Submit and verify it reaches success page

The S3 upload and database saving will work regardless of QR code images!
