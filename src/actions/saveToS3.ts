import { saveToDb } from "./saveToDb";


export async function saveToS3(formData: FormData, url: string) {
    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        const key = formData.get("key");
        const fileName = key ? key.toString().split("/").pop() : "unknown";
        const fileContentType = formData.get("Content-Type") || "unknown";

        const dbSave = await saveToDb(url, `${fileName}`, `${fileContentType}`);
        if (!dbSave) {
            console.error("Failed to save file to database");
            return false;
        }
        if (dbSave) {
            console.log("File saved to database");
        }
        
        return true;
    } else {
        console.error("S3 Upload Error:", response);
        return false;
    }
}