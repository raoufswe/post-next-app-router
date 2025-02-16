import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createProjectSchema } from "@/lib/schemas/project";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    } 

    const body = await request.json();
    const validated = createProjectSchema.parse(body);

      const user = await currentUser();
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create user if doesn't exist
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        email: user.emailAddresses[0]?.emailAddress as string,
        id: userId,
        role: "super_admin",
      },
      update: {},
    });

    const project = await prisma.project.create({
      data: {
        name: validated.name,
        size: validated.size, 
        users: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "asc" },
      where: {
        deletedAt: null,
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    // return NextResponse.json(
    //   { error: "Failed to fetch projects" },
    //   { status: 500 }
    // );
  }
} 