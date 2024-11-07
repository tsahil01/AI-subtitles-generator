"use server";

import { saveToDb } from "./saveToDb";

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

export async function saveToS3(formData: FormData, presignedUrl: string, fileName: string, audioType: string, transactionId: string) {
    console.log("Inside saveToS3...");
    console.log("formData: ", formData);
    console.log("presignedUrl: ", presignedUrl);
    console.log("fileName: ", fileName);
    console.log("audioType: ", audioType);
    console.log("transactionId: ", transactionId);

    console.log("Fetching presignedUrl...");
    const response = await fetch(presignedUrl, {
        method: "POST",
        body: formData,
    });

    console.log("S3 Upload Response: ", response);

    if (response.ok) {
        const key = formData.get("key") || "unknown";
        console.log("Key: ", key);

        const fileContentType = formData.get("Content-Type") || "unknown";
        const url = await `${CLOUDFRONT_URL}/${key}`;

        // Save file to database with payment status as pending
        const dbSave = await saveToDb(url, `${fileName}`, `${fileContentType}`, audioType, key.toString(), transactionId);

        if (dbSave === null) {
            console.error("Failed to save file to database");
            return false;
        }
        if (dbSave !== null) {
            console.log("File saved to database");
            console.log("Transcription job awaited");
        }
        console.log("Uploaded Url: ", formData.get("key"));

        return true;
    } else {
        console.error("S3 Upload Error:", response);
        return false;
    }
}