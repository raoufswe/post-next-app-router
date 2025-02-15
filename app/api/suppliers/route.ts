import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { supplierSchema } from "@/lib/schemas/supplier";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return Response.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const suppliers = await prisma.supplier.findMany({
    orderBy: { createdAt: 'asc' },
    where: { deletedAt: null, projectId },
  });

  return Response.json(suppliers);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const validated = supplierSchema.parse(data);
  const projectId = data.projectId;

  const supplier = await prisma.supplier.create({
    data: { ...validated, projectId },
  });

  return Response.json(supplier);
} 