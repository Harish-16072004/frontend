require('dotenv').config();
const AWS = require('aws-sdk');
const QRCode = require('qrcode');

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const testS3Upload = async () => {
  try {
    console.log('🔧 Testing S3 Configuration...\n');

    // Check AWS credentials
    console.log('📋 AWS Configuration:');
    console.log(`  - Region: ${process.env.AWS_REGION}`);
    console.log(`  - Bucket: ${process.env.AWS_S3_BUCKET_NAME}`);
    console.log(`  - Access Key: ${process.env.AWS_ACCESS_KEY_ID?.substring(0, 10)}...`);
    console.log(`  - Secret Key: ${process.env.AWS_SECRET_ACCESS_KEY ? '***configured***' : '❌ MISSING'}`);

    // Test 1: Generate QR code
    console.log('\n📊 Test 1: Generating QR Code...');
    const testData = {
      participantId: 'TEST001',
      name: 'Test User',
      email: 'test@example.com',
      registrationType: 'both',
      eventName: 'SHACKLES 2025',
      generatedAt: new Date().toISOString()
    };

    const qrBuffer = await QRCode.toBuffer(JSON.stringify(testData), {
      errorCorrectionLevel: 'H',
      type: 'png',
      quality: 1,
      margin: 2,
      width: 500,
      color: {
        dark: '#1F2937',
        light: '#FFFFFF'
      }
    });
    console.log(`✅ QR Code generated (${qrBuffer.length} bytes)`);

    // Test 2: Upload to S3
    console.log('\n📤 Test 2: Uploading to S3...');
    const timestamp = Date.now();
    const key = `participant-qr-code/test-${timestamp}-TEST001.png`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: qrBuffer,
      ContentType: 'image/png'
      // Removed ACL - bucket uses bucket policy for public access
    };

    console.log(`  - Uploading to: ${key}`);
    const result = await s3.upload(params).promise();

    console.log('\n✅ Upload Successful!');
    console.log(`  - URL: ${result.Location}`);
    console.log(`  - Key: ${result.Key}`);
    console.log(`  - ETag: ${result.ETag}`);

    // Test 3: Verify file exists
    console.log('\n🔍 Test 3: Verifying file exists...');
    const headParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: result.Key
    };

    const headResult = await s3.headObject(headParams).promise();
    console.log('✅ File verified in S3');
    console.log(`  - Content Type: ${headResult.ContentType}`);
    console.log(`  - Content Length: ${headResult.ContentLength} bytes`);
    console.log(`  - Last Modified: ${headResult.LastModified}`);

    // Test 4: List files in participant-qr-code folder
    console.log('\n📁 Test 4: Listing files in participant-qr-code folder...');
    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: 'participant-qr-code/',
      MaxKeys: 10
    };

    const listResult = await s3.listObjectsV2(listParams).promise();
    console.log(`✅ Found ${listResult.KeyCount} files in participant-qr-code folder:`);
    listResult.Contents.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.Key} (${file.Size} bytes)`);
    });

    console.log('\n═══════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════');
    console.log('\n🎉 S3 Upload is working correctly!');
    console.log(`📸 Test QR Code URL: ${result.Location}`);
    console.log('\nYou can now proceed with payment verification.');

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('═══════════════════════════════════════');
    console.error('Error:', error.message);
    
    if (error.code === 'InvalidAccessKeyId') {
      console.error('\n🔑 Issue: Invalid AWS Access Key');
      console.error('Fix: Check AWS_ACCESS_KEY_ID in .env file');
    } else if (error.code === 'SignatureDoesNotMatch') {
      console.error('\n🔑 Issue: Invalid AWS Secret Key');
      console.error('Fix: Check AWS_SECRET_ACCESS_KEY in .env file');
    } else if (error.code === 'NoSuchBucket') {
      console.error('\n🪣 Issue: S3 Bucket does not exist');
      console.error('Fix: Check AWS_S3_BUCKET_NAME in .env file');
    } else if (error.code === 'AccessDenied') {
      console.error('\n🚫 Issue: No permission to upload');
      console.error('Fix: Check IAM permissions for the AWS user');
    }
    
    console.error('\nFull error details:');
    console.error(error);
  }
};

testS3Upload();
