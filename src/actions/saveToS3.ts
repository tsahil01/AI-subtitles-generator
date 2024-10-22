"use server";

import { saveToDb } from "./saveToDb";
import { processFile } from "./transcriptionJob";

const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

export async function saveToS3(formData: FormData, presignedUrl: string) {
    const response = await fetch(presignedUrl, {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        const key = formData.get("key");
        console.log("Key: ", key);
        const fileName = key ? key.toString().split("/").pop() : "unknown";
        const fileContentType = formData.get("Content-Type") || "unknown";
        const url = await `${CLOUDFRONT_URL}/${key}`;

        const dbSave = await saveToDb(url, `${fileName}`, `${fileContentType}`);
        if (dbSave === null) {
            console.error("Failed to save file to database");
            return false;
        }
        if (dbSave !== null) {
            console.log("File saved to database");
            // @ts-ignore
            await processFile(key.toString(), dbSave.id);
        }
        console.log("Uploaded Url: ", formData.get("key"));

        return true;
    } else {
        console.error("S3 Upload Error:", response);
        return false;
    }
}