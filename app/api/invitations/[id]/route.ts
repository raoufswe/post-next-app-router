import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const clerk = await clerkClient();
    await clerk.invitations.revokeInvitation(params.id);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Revoking invitation failed", error);
    return new NextResponse(error.message, { status: 500 });
  }
} 