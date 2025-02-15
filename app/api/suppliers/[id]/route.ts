import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { supplierSchema } from "@/lib/schemas/supplier";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const validated = supplierSchema.parse(data);

  const supplier = await prisma.supplier.update({
    where: { id: params.id },
    data: validated,
  });

  return Response.json(supplier);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.supplier.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  });

  return new Response(null, { status: 204 });
} 