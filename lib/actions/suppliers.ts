'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchApi } from "@/lib/fetch";
import type { Supplier } from "@prisma/client";
import { cookies } from "next/headers";

export async function createSupplier(formData: FormData) {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  const values = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    projectId,
  };

  const response = await fetchApi<Supplier>("/api/suppliers", {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (response.success) {
    revalidatePath("/dashboard/suppliers");
    redirect("/dashboard/suppliers");
  }

  return response;
}

export async function updateSupplier(id: string, formData: FormData) {
  const values = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
  };

  const response = await fetchApi<Supplier>(`/api/suppliers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  });

  if (response.success) {
    revalidatePath("/dashboard/suppliers");
    redirect("/dashboard/suppliers");
  }

  return response;
} 