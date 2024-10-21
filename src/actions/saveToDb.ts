"use server";

import { NEXTAUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export async function saveToDb(fileUrl: string, fileName: string, fileContentType: string) {
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
                userId: userId,
            }
        });
        if (!addFile) {
            console.log("Failed to save file to database");
            return false;
        }
        console.log("File saved to database:", addFile);
        return true;

    } catch (error: any) {
        console.error("Error saving file to database:", error);
        return false;
    }
}