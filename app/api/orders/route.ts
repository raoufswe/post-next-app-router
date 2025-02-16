import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return Response.json({ error: 'Project ID is required' }, { status: 400 });
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

  return Response.json(orders);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const order = await prisma.order.create({
    data,
    include: {
      User: true,
      OrderProduct: {
        include: {
          Product: true,
        },
      },
    },
  });

  return Response.json(order);
} 