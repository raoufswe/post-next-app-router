import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "../../utils/apiResponse";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        projects: { 
          where: { deletedAt: null },
        },
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return errorResponse("Failed to fetch user", 500);
  }
} 