import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { uploadMediaFiles } from "@/lib/cloudinary";
import { productSchema } from "@/lib/schemas/product";
import { successResponse, errorResponse } from "../../utils/apiResponse";

export async function GET(
  request: NextRequest,
  context: Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await context;
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      console.error("[PRODUCT_GET]", "Project ID is required");
      return errorResponse('Project ID is required', 400);
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        supplier: true,
      },
    });

    if (!product) {
      console.error("[PRODUCT_GET]", "Product not found");
      return errorResponse('Product not found', 404);
    }

    return successResponse(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return errorResponse("Failed to fetch product", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  context: Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await context;
    const data = await request.json();
    const validated = productSchema.parse(data);
    const { categoryIds, mediaFiles, ...rest } = validated;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...rest,
        categories: {
          set: categoryIds.map((categoryId) => ({ id: categoryId })),
        },
      },
    });

    if (mediaFiles?.length) {
      await prisma.product.update({
        where: { id: params.id },
        data: {
          mediaUrls: await uploadMediaFiles(mediaFiles, {
            projectId: product.projectId,
            id: params.id,
          }),
        },
      });
    }

    return successResponse(product);
  } catch (error) {
    console.error("[PRODUCT_UPDATE]", error);
    return errorResponse("Failed to update product", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  context: Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await context;
    const product = await prisma.product.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return successResponse(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return errorResponse("Failed to delete product", 500);
  }
} 