import { auth, clerkClient } from '@clerk/nextjs/server'
import { createInvitationSchema } from "@/lib/schemas/invitation";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
  
    if (!projectId) {
      console.error("[INVITATION_LIST]", "Project ID is required");
      return errorResponse('Project ID is required', 400);
    }

    const clerk = await clerkClient();
    const { data: invitations } = await clerk.invitations.getInvitationList();

    const filteredInvitations = invitations.filter(
      (invitation) => invitation.publicMetadata?.projectId === projectId
    );
    return successResponse(filteredInvitations);
  } catch (error: unknown) {
    console.error("[INVITATION_LIST]", error);
    const message = error instanceof Error ? error.message : "Failed to get invitations";
    return errorResponse(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("[INVITATION_CREATE]", "Unauthorized request");
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const validated = createInvitationSchema.parse(body);

    const clerk = await clerkClient();
   const data = await clerk.invitations.createInvitation({
      emailAddress: validated.emailAddress,
      publicMetadata: {
        isInvited: true,
        invitedBy: userId,
        role: validated.role,
        projectId: validated.projectId,
      },
    });

    return successResponse({ success: true, data}, 201);
  } catch (error) {
    console.error("[INVITATION_CREATE]", error);
    return errorResponse("Failed to create invitation", 500);
  }
} 