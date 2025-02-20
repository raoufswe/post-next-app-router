'use server'

import { revalidatePath } from "next/cache";
import {  fetchApi } from "@/lib/fetch";
import { type Invitation } from "@/types";
import { cookies } from "next/headers";


export async function createInvitation(
  formData: FormData
) {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  const data = {
    emailAddress: formData.get("emailAddress"),
    role: formData.get("role"),
    projectId,
  };

  const response = await fetchApi<Invitation>('/api/invitations', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.success) {
    revalidatePath('/dashboard/users');
  }

  return response;
}

export async function revokeInvitation(invitationId: string) {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  const response = await fetchApi<Invitation>(
    `/api/invitations/${invitationId}/revoke?projectId=${projectId}`,
    {
      method: 'POST',
    }
  );

  if (response.success) {
    revalidatePath('/dashboard/users');
  }

  return response;
}