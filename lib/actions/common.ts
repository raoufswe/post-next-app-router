'use server';

import { fetchApi } from "@/lib/fetch";

export async function deleteResource(url: string, id: string) {
  const response = await fetchApi(`${url}/${id}`, {
    method: 'DELETE',
  });

  return response;
} 