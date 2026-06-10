import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getRequiredEnv } from "./env";

// Lazy init: credentials are only read when an upload actually happens, so the
// rest of the app runs without S3 configured (matches the mongo.ts pattern).
let client: S3Client | null = null;

function getConfig() {
    const region = getRequiredEnv("AWS_REGION");
    // Accept a bare bucket name or an "s3://bucket" URI; drop any trailing slash.
    const bucket = getRequiredEnv("AWS_S3_BUCKET").replace(/^s3:\/\//i, "").replace(/\/+$/, "");
    const accessKeyId = getRequiredEnv("AWS_ACCESS_KEY_ID");
    const secretAccessKey = getRequiredEnv("AWS_SECRET_ACCESS_KEY");
    // Optional override for a CDN / custom domain; otherwise the standard S3 URL.
    const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL?.replace(/\/+$/, "");
    return { region, bucket, accessKeyId, secretAccessKey, publicBaseUrl };
}

export async function uploadToS3(
    body: Buffer,
    contentType: string,
    key: string,
): Promise<{ url: string; key: string }> {
    const { region, bucket, accessKeyId, secretAccessKey, publicBaseUrl } = getConfig();

    if (!client) {
        client = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
    }

    await client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
        }),
    );

    const url = publicBaseUrl
        ? `${publicBaseUrl}/${key}`
        : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return { url, key };
}
