"use server";

import { NEXTAUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export async function saveToDb(fileUrl: string, fileName: string, fileContentType: string, audioLanguage: string, key: string) {
    const session = await getServerSession(NEXTAUTH_CONFIG);
    if (!session) {
        console.log("You must be logged in to upload files");
        return false;
    }
    try {
        const userId = session.userId;
        const addFile = await prisma.file.create({
            data: {
                name: fileName,
                url: fileUrl,
                type: fileContentType,
                audioLanguage: audioLanguage,
                key: key,
                userId: userId,
            }
        });
        if (!addFile) {
            console.log("Failed to save file to database");
            return null;
        }
        console.log("File saved to database:", addFile);
        return addFile;

    } catch (error: any) {
        console.error("Error saving file to database:", error);
        return null;
    }
}