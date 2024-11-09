import { saveToDb } from "@/actions/saveToDb";
import { NEXTAUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {  z } from "zod";

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

const s3UploadSchema = z.object({
    formData: z.any(),
    presignedUrl: z.string(),
    fileName: z.string(),
    audioType: z.string(),
    transactionId: z.string(),
})

export async function POST(req: Request) {
    const session = await getServerSession(NEXTAUTH_CONFIG);
    if (!session || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { formData, presignedUrl, fileName, audioType, transactionId } = s3UploadSchema.parse(req.body);
        console.log("formData: ", formData);
        console.log("presignedUrl: ", presignedUrl);
        console.log("fileName: ", fileName);
        console.log("audioType: ", audioType);
        console.log("transactionId: ", transactionId);

        const response = await fetch(presignedUrl, {
            method: "POST",
            body: formData,
        });

        if (response) {
            const key = formData.get("key") || "unknown";
            console.log("Key: ", key);

            const fileContentType = formData.get("Content-Type") || "unknown";
            const url = `${CLOUDFRONT_URL}/${key}`;

            const dbSave = await saveToDb(url, `${fileName}`, `${fileContentType}`, audioType, key.toString(), transactionId);
            console.log("dbSave: ", dbSave);

            if (dbSave === null) {
                console.error("Failed to save file to database");
                return NextResponse.json({ error: "Failed to save file to database" }, { status: 500 });
            }

            if (dbSave !== null) {
                console.log("File saved to database");
                console.log("Transcription job awaited");
            }

            console.log("Uploaded Url: ", formData.get("key"));

            return NextResponse.json({
                message: "File uploaded successfully",
                url: formData.get("key"),
                data: true
            })

        }

    } catch (error: any) {
        return await NextResponse.json(
            {
                error: "Error in POST /api/s3upload: " + error.message,
                data: false
            },
            { status: 500 },
        );
    }
}
