import { auth, clerkClient } from "@clerk/nextjs/server";
import { successResponse, errorResponse } from "../../../utils/apiResponse";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const clerk = await clerkClient();
    await clerk.invitations.revokeInvitation(params.id);

    return successResponse({ success: true });
  } catch (error) {
    console.error("[INVITATION_REVOKE]", error);
    return errorResponse("Failed to revoke invitation", 500);
  }
} 