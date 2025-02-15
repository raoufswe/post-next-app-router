import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from "next/server";
import { createInvitationSchema } from "@/lib/schemas/invitation";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const clerk = await clerkClient();
    const { data: invitations } = await clerk.invitations.getInvitationList();

    return NextResponse.json(invitations);
  } catch (error: any) {
    console.error("Getting invitations failed", error);
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validated = createInvitationSchema.parse(body);

    const clerk = await clerkClient();
    await clerk.invitations.createInvitation({
      emailAddress: validated.emailAddress,
      publicMetadata: {
        isInvited: true,
        invitedBy: userId,
        role: validated.role,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
} 