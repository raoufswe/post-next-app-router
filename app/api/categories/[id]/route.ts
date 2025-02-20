import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { categorySchema } from "@/lib/schemas/category";
import { successResponse, errorResponse } from "../../utils/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findFirst({
      where: { id: params.id, deletedAt: null },
    });

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(category);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return errorResponse("Failed to fetch category", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const validated = categorySchema.parse(data);

    const category = await prisma.category.update({
      where: { id: params.id },
      data: validated,
    });

    return successResponse(category);
  } catch (error) {
    console.error("[CATEGORY_UPDATE]", error);
    return errorResponse("Failed to update category", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return successResponse(category);
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return errorResponse("Failed to delete category", 500);
  }
} 