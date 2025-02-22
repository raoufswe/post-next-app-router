'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchApi } from "@/lib/fetch";
import type { Category } from "@prisma/client";
import { cookies } from "next/headers";

export async function createCategory(formData: FormData) {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  const values = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    projectId,
    parentId: formData.get("parentId") || null
  };

  const response = await fetchApi<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (response.success) {
    revalidatePath("/dashboard/categories");
    redirect("/dashboard/categories");
  }

  return response;
}

export async function updateCategory(id: string, formData: FormData) {
  const values = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    parentId: formData.get("parentId") || null
  };

  const response = await fetchApi<Category>(`/api/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  });

  if (response.success) {
    revalidatePath("/dashboard/categories");
    redirect("/dashboard/categories");
  }

  return response;
} 