

require("dotenv").config({ path: '../../../src/.env' });
const aws = require("aws-sdk");



aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
    // Note: 'bucket' is not a valid AWS SDK configuration property
});

const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new aws.S3();



async function s3POC(){
    const response = await s3.listObjectsV2({ Bucket: BUCKET_NAME, Prefix: "About_Us/Purbayan_Das" }).promise();
    console.log(response)
}

s3POC();