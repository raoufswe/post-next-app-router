import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { uploadMediaFiles } from "@/lib/cloudinary";
import { productSchema } from "@/lib/schemas/product";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');
  const categorySlug = searchParams.get('categorySlug');

  if (!projectId) {
    return Response.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const where = {
    deletedAt: null,
    projectId,
    ...(categorySlug && {
      Category: {
        some: { slug: categorySlug },
      },
    }),
  };

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
    where,
    include: {
      Category: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'asc' },
      },
      Supplier: true,
    },
  });

  return Response.json(
    products.map((product) => ({
      ...product,
      categoryIds: product.Category.map((c) => c.id),
      categories: product.Category,
      supplier: product.Supplier,
    }))
  );
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const validated = productSchema.parse(data);
  const { categoryIds, mediaFiles, ...rest } = validated;
  const projectId = data.projectId;

  const product = await prisma.product.create({
    data: {
      ...rest,
      projectId,
      Category: { 
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

  return Response.json(product);
} 