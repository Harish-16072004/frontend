require('dotenv').config();
const AWS = require('aws-sdk');

console.log('\n🧪 Testing AWS S3 Connection...');
console.log('================================\n');

// Display configuration (masked)
console.log('Configuration:');
console.log('  Access Key:', process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID.substring(0, 8) + '...' : '❌ NOT SET');
console.log('  Secret Key:', process.env.AWS_SECRET_ACCESS_KEY ? '***' + process.env.AWS_SECRET_ACCESS_KEY.substring(process.env.AWS_SECRET_ACCESS_KEY.length - 4) : '❌ NOT SET');
console.log('  Region:', process.env.AWS_REGION || '❌ NOT SET');
console.log('  Bucket:', process.env.AWS_S3_BUCKET_NAME || '❌ NOT SET');
console.log('');

// Check if all required variables are set
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || 
    !process.env.AWS_REGION || !process.env.AWS_S3_BUCKET_NAME) {
  console.error('❌ Missing AWS credentials in .env file!');
  console.log('\nRequired variables:');
  console.log('  AWS_ACCESS_KEY_ID');
  console.log('  AWS_SECRET_ACCESS_KEY');
  console.log('  AWS_REGION');
  console.log('  AWS_S3_BUCKET_NAME');
  console.log('\nPlease update your .env file and try again.\n');
  process.exit(1);
}

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Test 1: List buckets (verify credentials)
console.log('Test 1: Verifying AWS credentials...');
s3.listBuckets((err, data) => {
  if (err) {
    console.error('   ❌ Error:', err.code);
    console.error('   Message:', err.message);
    console.log('\n   💡 Troubleshooting:');
    if (err.code === 'InvalidAccessKeyId') {
      console.log('   - Check your AWS_ACCESS_KEY_ID in .env file');
      console.log('   - It should start with "AKIA"');
    } else if (err.code === 'SignatureDoesNotMatch') {
      console.log('   - Check your AWS_SECRET_ACCESS_KEY in .env file');
      console.log('   - Make sure there are no extra spaces');
    }
    process.exit(1);
  } else {
    console.log('   ✅ AWS credentials are valid!');
    console.log('   📦 Available buckets:');
    data.Buckets.forEach(bucket => {
      const isTarget = bucket.Name === process.env.AWS_S3_BUCKET_NAME;
      console.log(`      ${isTarget ? '👉' : '  '} ${bucket.Name}`);
    });
    
    // Test 2: Check specific bucket
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    console.log(`\nTest 2: Checking bucket "${bucketName}"...`);
    
    s3.headBucket({ Bucket: bucketName }, (err, data) => {
      if (err) {
        console.error('   ❌ Error:', err.code);
        console.error('   Message:', err.message);
        console.log('\n   💡 Troubleshooting:');
        if (err.code === 'NotFound') {
          console.log('   - Bucket does not exist');
          console.log('   - Check AWS_S3_BUCKET_NAME in .env file');
          console.log('   - Create bucket in AWS Console');
        } else if (err.code === 'Forbidden') {
          console.log('   - Access denied to this bucket');
          console.log('   - Check IAM user permissions');
        }
        process.exit(1);
      } else {
        console.log('   ✅ Bucket exists and is accessible!');
        
        // Test 3: List objects in bucket
        console.log('\nTest 3: Listing objects in bucket...');
        s3.listObjectsV2({ 
          Bucket: bucketName, 
          MaxKeys: 10 
        }, (err, data) => {
          if (err) {
            console.error('   ❌ Error:', err.code);
            console.error('   Message:', err.message);
          } else {
            console.log(`   ✅ Successfully connected to bucket!`);
            console.log(`   📊 Objects found: ${data.KeyCount}`);
            
            if (data.Contents && data.Contents.length > 0) {
              console.log('   📁 Sample files:');
              data.Contents.slice(0, 5).forEach(obj => {
                console.log(`      - ${obj.Key} (${(obj.Size / 1024).toFixed(2)} KB)`);
              });
            } else {
              console.log('   📭 Bucket is empty (this is normal for new buckets)');
            }
          }
          
          console.log('\n================================');
          console.log('✅ S3 Connection Test Complete!');
          console.log('================================');
          console.log('\n✨ Your S3 is ready to use!');
          console.log('   You can now:');
          console.log('   - Upload user profile pictures');
          console.log('   - Upload event images');
          console.log('   - Store documents and files');
          console.log('\n🚀 Start your backend and test uploads!\n');
        });
      }
    });
  }
});
