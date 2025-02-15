import { UsersTable } from "@/components/dashboard/users/users-table";
import { clerkClient } from "@clerk/nextjs/server";
import { InviteUserDialog } from "@/components/dashboard/users/invite-user-dialog";

type InvitationStatus = "accepted" | "pending" | "revoked";

interface Invitation {
  id: string;
  emailAddress: string;
  status: InvitationStatus;
  publicMetadata: {
    role?: string;
    isInvited?: boolean;
    invitedBy?: string;
  } | null;
}

async function getInvitations() {
  const clerk = await clerkClient();
  const { data } = await clerk.invitations.getInvitationList();

  return data.map(
    (invitation): Invitation => ({
      id: invitation.id,
      emailAddress: invitation.emailAddress,
      status: invitation.status as InvitationStatus,
      publicMetadata: invitation.publicMetadata,
    })
  );
}

export default async function UsersPage() {
  const invitations = await getInvitations();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <InviteUserDialog />
      </div>
      <UsersTable initialInvitations={invitations} />
    </div>
  );
}
