"use server"

import { NEXTAUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export async function contact(name: string, email: string, subject: string, message: string) {
    const user = await getServerSession(NEXTAUTH_CONFIG);
    console.log("user", user);
    try {
        const response = await prisma.contact.create({
            data: {
                name,
                userId: user.userId,
                email,
                subject,
                message
            }
        })
        if(!response) {
            throw new Error('Error creating contact');
        }
        return true;

    } catch (error) {
        console.error(error);
        return false
    }
}