"use server";

import { NEXTAUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export async function getUploadedFiles() {
    const { userId, web3Address } = await getServerSession(NEXTAUTH_CONFIG);

    if (!userId) {
        throw new Error("User not authenticated");
        return;
    }

    const files = await prisma.file.findMany({
        where: {
            userId,
        },
        include: {
            user: true,
            subtitles: true,
        }
    });
    console.log(files);
    return files;
}