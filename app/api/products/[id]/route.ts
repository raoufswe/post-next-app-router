import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { uploadMediaFiles } from "@/lib/cloudinary";
import { productSchema } from "@/lib/schemas/product";
import { NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const validated = productSchema.parse(data);
  const { categoryIds, mediaFiles, ...rest } = validated;

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...rest,
      category: {
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

  return Response.json(product);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await Promise.resolve(params);
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return Response.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      supplier: true,
    },
  });

  if (!product) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }

  return Response.json(product);
} 