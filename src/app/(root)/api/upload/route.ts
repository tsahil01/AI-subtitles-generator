import { NextRequest, NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getServerSession } from "next-auth";
import { NEXTAUTH_CONFIG } from "@/lib/auth";

export async function GET(req: NextRequest) {

    const session = await getServerSession(NEXTAUTH_CONFIG);
    const userId = session?.userId;
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    const contentType = searchParams.get("contentType");

    if (!userId) {
        return NextResponse.json(
            { error: "You must be logged in to upload files" },
            { status: 401 }
        );
    }

    // Check if filename and contentType are provided
    if (!filename || !contentType) {
        return NextResponse.json(
            { error: "Filename and Content-Type are required" },
            { status: 400 }
        );
    }

    try {
        const client = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET!,
            },
        });

        const { url, fields } = await createPresignedPost(client, {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: `${userId}/${filename}/${filename}`,
            Conditions: [["starts-with", "$Content-Type", contentType]],
            Fields: {
                acl: "public-read",
                "Content-Type": contentType,
            },
            Expires: 3600,
        });

        console.log("Presigned URL:", url);

        return NextResponse.json({ url, fields });
    } catch (error: any) {
        console.error("Error creating presigned post:", error);
        return NextResponse.json(
            { error: "Error creating presigned post: " + error.message },
            { status: 500 }
        );
    }
}
