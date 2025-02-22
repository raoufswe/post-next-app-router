import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { successResponse, errorResponse } from "../utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      console.error("[ORDER_LIST]", "Project ID is required");
      return errorResponse('Project ID is required', 400);
    }

    const orders = await prisma.order.findMany({
      where: {
        projectId,
      },
      include: {
        user: true,
        orderProducts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(orders);
  } catch (error) {
    console.error("[ORDER_LIST]", error);
    return errorResponse("Failed to fetch orders", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const order = await prisma.order.create({
      data,
      include: {
        user: true,
        orderProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    return successResponse(order, 201);
  } catch (error) {
    console.error("[ORDER_CREATE]", error);
    return errorResponse("Failed to create order", 500);
  }
} 