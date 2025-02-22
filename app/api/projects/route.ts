import { auth } from "@clerk/nextjs/server";
import { createProjectSchema } from "@/lib/schemas/project";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "../utils/apiResponse";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("[PROJECT_CREATE]", "Unauthorized request");
      return errorResponse("Unauthorized", 401);
    } 

    const body = await request.json();
    const validated = createProjectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        name: validated.name,
        size: validated.size, 
        users: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return successResponse(project, 201);
  } catch (error) {
    console.error("[PROJECT_CREATE]", error);
    return errorResponse("Failed to create project", 500);
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("[PROJECT_LIST]", "Unauthorized request");
      return errorResponse("Unauthorized", 401);
    }

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "asc" },
      where: {
        deletedAt: null,
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return successResponse(projects);
  } catch (error) {
    console.error("[PROJECT_LIST]", error);
    return errorResponse("Failed to fetch projects", 500);
  }
} 