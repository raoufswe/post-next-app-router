import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { uploadMediaFiles } from "@/lib/cloudinary";
import { productSchema } from "@/lib/schemas/product";
import { successResponse, errorResponse } from "../utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const categorySlug = searchParams.get('categorySlug');

    if (!projectId) {
      console.error("[PRODUCT_LIST]", "Project ID is required");
      return errorResponse('Project ID is required', 400);
    }

    const where = {
      deletedAt: null,
      projectId,
      ...(categorySlug && {
        category: {
          some: { slug: categorySlug },
        },
      }),
    };

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
      where,
      include: {
        categories: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
        },
        supplier: true,
      },
    });

    
    return successResponse(products.map((product) => ({
      ...product,
      categoryIds: product.categories.map((i) => i.id),
    })));
  } catch (error) {
    console.error("[PRODUCT_LIST]", error);
    return errorResponse("Failed to fetch products", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validated = productSchema.parse(data);
    const { categoryIds, mediaFiles, ...rest } = validated;
    const projectId = data.projectId;

    const product = await prisma.product.create({
      data: {
        ...rest,
        projectId,
        categories: {
          connect: categoryIds.map((id) => ({ id })) 
        },
      },
    });

    if (mediaFiles?.length) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          mediaUrls: await uploadMediaFiles(mediaFiles, {
            projectId,
            id: product.id,
          }),
        },
      });
    }

    return successResponse(product, 201);
  } catch (error) {
    console.error("[PRODUCT_CREATE]", error);
    return errorResponse("Failed to create product", 500);
  }
} 