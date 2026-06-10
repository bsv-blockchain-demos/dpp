import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "../../../lib/s3";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
    "application/pdf",
]);

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No file provided." }, { status: 400 });
        }

        const blob = file as File;

        if (blob.size > MAX_BYTES) {
            return NextResponse.json({ error: "File too large (max 10 MB)." }, { status: 400 });
        }

        const contentType = blob.type || "application/octet-stream";
        if (!ALLOWED_TYPES.has(contentType)) {
            return NextResponse.json(
                { error: "Unsupported file type. Use PNG, JPG, WebP, GIF, or PDF." },
                { status: 400 },
            );
        }

        const buffer = Buffer.from(await blob.arrayBuffer());
        const safeName = (blob.name || "file")
            .replace(/[^a-zA-Z0-9._-]/g, "_")
            .slice(-60);
        const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

        const { url } = await uploadToS3(buffer, contentType, key);
        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload error:", error);
        const missingEnv =
            error instanceof Error && /Missing required environment variable/.test(error.message);
        return NextResponse.json(
            {
                error: missingEnv
                    ? "Image uploads aren't configured on the server yet."
                    : "Failed to upload the file. Please try again.",
            },
            { status: 500 },
        );
    }
}
