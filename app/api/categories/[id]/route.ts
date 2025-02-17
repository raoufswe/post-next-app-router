import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { categorySchema } from "@/lib/schemas/category";
import { NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const category = await prisma.category.findFirst({
    where: { id: params.id, deletedAt: null },
  });

  if (!category) {
    return Response.json({ error: 'Category not found' }, { status: 404 });
  }

  return Response.json(category);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const validated = categorySchema.parse(data);

  const category = await prisma.category.update({
    where: { id: params.id },
    data: validated,
  });

  return Response.json(category);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 