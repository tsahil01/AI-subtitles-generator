"use server"

import { NEXTAUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/db";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getServerSession } from "next-auth";

export async function doTransaction(amount: number, transactionId: string) {
    const session = await getServerSession(NEXTAUTH_CONFIG);
    if (!session) {
        console.error("You must be logged in to make half transactions");
        return false;
    }
    try {
        const tnx = await prisma.payment.create({
            data: {
                amount: amount * LAMPORTS_PER_SOL,
                status: "PENDING",
                userId: session.userId,
                transactionId: transactionId,
            }
        })

        console.log("Transaction saved to database: ", tnx);
        return tnx;
    }
    catch (error: any) {
        console.error("Error saving transaction to database:", error);
        return null;
    }
}