import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { supplierSchema } from "@/lib/schemas/supplier";
import { successResponse, errorResponse } from "../utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      console.error("[SUPPLIER_LIST]", "Project ID is required");
      return errorResponse('Project ID is required', 400);
    }

    const suppliers = await prisma.supplier.findMany({
      orderBy: { createdAt: 'asc' },
      where: { deletedAt: null, projectId },
    });

    return successResponse(suppliers);
  } catch (error) {
    console.error("[SUPPLIER_LIST]", error);
    return errorResponse("Failed to fetch suppliers", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validated = supplierSchema.parse(data);
    const projectId = data.projectId;

    const supplier = await prisma.supplier.create({
      data: { ...validated, projectId },
    });

    return successResponse(supplier, 201);
  } catch (error) {
    console.error("[SUPPLIER_CREATE]", error);
    return errorResponse("Failed to create supplier", 500);
  }
} 