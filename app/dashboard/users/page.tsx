import { UsersTable } from "@/components/dashboard/users/users-table";
import { InviteUserDialog } from "@/components/dashboard/users/invite-user-dialog";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

async function getInvitations() {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;
  const { getToken } = await auth();
  const token = await getToken();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/invitations?projectId=${projectId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch invitations");
  }

  return response.json();
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
