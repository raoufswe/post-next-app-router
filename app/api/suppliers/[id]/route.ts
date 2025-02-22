import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { supplierSchema } from "@/lib/schemas/supplier";
import { successResponse, errorResponse } from "../../utils/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { 
        id: params.id,
        deletedAt: null
      },
    });

    if (!supplier) {
      console.error("[SUPPLIER_GET]", "Supplier not found");
      return errorResponse('Supplier not found', 404);
    }

    return successResponse(supplier);
  } catch (error) {
    console.error("[SUPPLIER_GET]", error);
    return errorResponse("Failed to fetch supplier", 500);
  }
} 

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const validated = supplierSchema.parse(data);

    const supplier = await prisma.supplier.update({
      where: { id: params.id, deletedAt: null },
      data: validated,
    });

    return successResponse(supplier);
  } catch (error) {
    console.error("[SUPPLIER_UPDATE]", error);
    return errorResponse("Failed to update supplier", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supplier = await prisma.supplier.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return successResponse(supplier);
  } catch (error) {
    console.error("[SUPPLIER_DELETE]", error);
    return errorResponse("Failed to delete supplier", 500);
  }
}