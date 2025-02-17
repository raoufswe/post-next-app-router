import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { supplierSchema } from "@/lib/schemas/supplier";
import { NextResponse } from "next/server";

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
  try {
    const supplier = await prisma.supplier.update({
      where: {
        id: params.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 