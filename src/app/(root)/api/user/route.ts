import { NEXTAUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, web3Address } = await getServerSession(NEXTAUTH_CONFIG);
  console.log(userId, web3Address);

  try {
    const details = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        files: true,
          payments: true,
      },
    });
    return NextResponse.json({
      user: details,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      error: "User not found",
    });
  }
}
