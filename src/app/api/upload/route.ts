import { NextRequest, NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    const contentType = searchParams.get("contentType");

    // Check if filename and contentType are provided
    if (!filename || !contentType) {
        return NextResponse.json(
            { error: "Filename and Content-Type are required" },
            { status: 400 }
        );
    }

    try {
        const client = new S3Client({ region: process.env.AWS_REGION });

        const { url, fields } = await createPresignedPost(client, {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: filename,
            Conditions: [["starts-with", "$Content-Type", contentType]],
            Fields: {
                acl: "public-read",
                "Content-Type": contentType,
            },
            Expires: 600,
        });

        return NextResponse.json({ url, fields });
    } catch (error: any) {
        console.error("Error creating presigned post:", error);
        return NextResponse.json(
            { error: "Error creating presigned post: " + error.message },
            { status: 500 }
        );
    }
}
