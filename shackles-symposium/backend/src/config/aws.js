const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-south-1'
});

// S3 Configuration
const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

// SES Configuration for Email
const ses = new AWS.SES({
  apiVersion: '2010-12-01'
});

// CloudFront Configuration
const cloudfront = new AWS.CloudFront();

module.exports = {
  s3,
  ses,
  cloudfront,
  AWS
};
