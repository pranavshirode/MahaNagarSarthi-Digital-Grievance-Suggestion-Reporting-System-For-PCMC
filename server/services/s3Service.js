import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Only initialize if we have credentials to prevent crashes locally
const hasAwsCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;
const s3 = hasAwsCredentials ? new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
}) : null;

const BUCKET = process.env.S3_BUCKET || "ns-fake-bucket";

/**
 * Upload a file buffer to S3.
 */
export async function uploadToS3(buffer, key, contentType) {
    if (!s3) {
        console.log(`[MOCK S3 UPLOAD] Uploaded ${key} locally.`);
        return key;
    }
    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        })
    );
    return key;
}

/**
 * Generate a pre-signed URL valid for 1 hour.
 * Use this at request time — never store the URL in the DB.
 */
export async function getPresignedUrl(key, expiresInSeconds = 3600) {
    if (!s3) {
        return `http://localhost:5000/mock-s3/${key}`;
    }
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}
