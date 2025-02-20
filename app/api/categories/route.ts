import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { categorySchema } from "@/lib/schemas/category";
import { successResponse, errorResponse } from "../utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return errorResponse('Project ID is required', 400);
    }

    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
      where: { 
        deletedAt: null,
        parentId: null,
        projectId,
      },
      include: {
        parent: true,
        children: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    
    return successResponse(categories);
  } catch (error) {
    console.error("[CATEGORY_LIST]", error);
    return errorResponse("Failed to fetch categories", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validated = categorySchema.parse(data);
    const projectId = data.projectId;

    const category = await prisma.category.create({
      data: { ...validated, projectId },
    });

    return successResponse(category, 201);
  } catch (error) {
    console.error("[CATEGORY_CREATE]", error);
    return errorResponse("Failed to create category", 500);
  }
} 