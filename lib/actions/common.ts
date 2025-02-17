'use server';

import { auth } from "@clerk/nextjs/server";

export async function deleteResource(url: string, id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const fullUrl = `${baseUrl}${url}/${id}`;
  const { getToken } = await auth();
  const token = await getToken();


  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete resource: ${response.statusText}`);
  }

  return response.json();
} 