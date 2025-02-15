'use server'

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface CreateInvitationInput {
  emailAddress: string;
  role: string;
}

export async function createInvitation(data: CreateInvitationInput) {
  try {
    const response = await fetch('/api/invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create invitation');
    }

    const result = await response.json();
    revalidatePath('/dashboard/users');
    return result;
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
}

export async function deleteInvitation(id: string) {
  try {
    const response = await fetch(`/api/invitations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete invitation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting invitation:', error);
    throw error;
  }
}

export async function revokeInvitation(invitationId: string) {
  try {
    const response = await fetch(`/api/invitations/${invitationId}/revoke`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to revoke invitation');
    }

    revalidatePath('/dashboard/users');
    return await response.json();
  } catch (error) {
    console.error('Error revoking invitation:', error);
    throw error;
  }
} 