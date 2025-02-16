import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        projects: { 
          where: { deletedAt: null },
        },
      },
    });

    return NextResponse.json(user);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 