import { NEXTAUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(NEXTAUTH_CONFIG);
  if (!session || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = session;

  try {
    const userDetails = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        files: {
          include: {
            subtitles: true,
          },
        },
        payments: true,
      },
    });

    if (!userDetails) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: userDetails,
    });
  } catch (e) {
    console.error("Error fetching user details:", e);
    return NextResponse.json(
      { error: "An error occurred while fetching user data" },
      { status: 500 }
    );
  }
}