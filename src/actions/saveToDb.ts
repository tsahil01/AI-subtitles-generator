"use server";

import { NEXTAUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/db";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getServerSession } from "next-auth";
import { subtitleDBCall } from "./transcriptionJob";

export async function saveToDb(fileUrl: string, fileName: string, fileContentType: string, audioLanguage: string, key: string, transactionId: string) {
    const session = await getServerSession(NEXTAUTH_CONFIG);
    if (!session) {
        console.log("You must be logged in to upload files");
        return false;
    }
    try {
        const userId = session.userId;

        const tnx = await prisma.$transaction([
            prisma.payment.update({
                where: {
                    transactionId: transactionId
                },
                data: {
                    status: "SUCCESS"
                },
                
            }),

            prisma.file.create({
                data: {
                    name: fileName,
                    url: fileUrl,
                    type: fileContentType,
                    audioLanguage: audioLanguage,
                    key: key,
                    userId: userId,
                    transactionId: transactionId

                }
            })
        ])

        console.log("File saved to database: ", tnx);

        if (!tnx) {
            console.log("Failed to save file to database");
            return null;
        }
        console.log("File saved to database:", tnx);
        const fileDbId:string = tnx[1].id;
        await subtitleDBCall(key, fileDbId);
        
        console.log("Transcription job awaited");

        return tnx;

    } catch (error: any) {
        console.error("Error saving file to database:", error);
        return null;
    }
}