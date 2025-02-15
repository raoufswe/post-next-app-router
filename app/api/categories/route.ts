import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { categorySchema } from "@/lib/schemas/category";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return Response.json({ error: 'Project ID is required' }, { status: 400 });
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

  return Response.json(categories);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const validated = categorySchema.parse(data);
  const projectId = data.projectId;

  const category = await prisma.category.create({
    data: { ...validated, projectId },
  });

  return Response.json(category);
} 