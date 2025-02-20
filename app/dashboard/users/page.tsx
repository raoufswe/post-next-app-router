import { InviteUserDialog } from "@/components/dashboard/users/invite-user-dialog";
import { UsersList } from "@/components/dashboard/users/users-list";
import { cookies } from "next/headers";
import { fetchApi } from "@/lib/fetch";
import { type Invitation } from "@/types";
import { ErrorFallback } from "@/components/dashboard/error-fallback";

async function getInvitations() {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  return fetchApi<Invitation[]>(`/api/invitations?projectId=${projectId}`);
}

export default async function UsersPage() {
  const response = await getInvitations();

  if (!response.success) {
    return <ErrorFallback error={response.error} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <InviteUserDialog />
      </div>
      <UsersList invitations={response.data} />
    </div>
  );
}
