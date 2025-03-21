"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { fetchApi } from "@/lib/fetch";
import type { Product as PrismaProduct } from "@prisma/client";
import type { ApiResponse } from "@/lib/fetch";

type Product = PrismaProduct & { categoryIds: string[] };

export async function createProduct(formData: FormData): Promise<ApiResponse<Product>> {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  const categoryIds = formData.get("categoryIds")?.toString().split(",") ?? [];
  const description = formData.get("description")?.toString() ?? "";

  const values = {
    name: formData.get("name"),
    description: [{ type: "paragraph", children: [{ text: description }] }],
    supplierId: formData.get("supplierId"),
    categoryIds,
    price: Number(formData.get("price")),
    currency: formData.get("currency"),
    quantity: Number(formData.get("quantity")),
    projectId,
  };

  const response = await fetchApi<PrismaProduct>("/api/products", {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (response.success) {
    revalidatePath("/dashboard/products");
  }

  return {
    ...response,
    data: response.success ? { ...response.data, categoryIds } : undefined,
  } as ApiResponse<Product>;
}

export async function updateProduct(id: string, formData: FormData): Promise<ApiResponse<Product>> {
  const categoryIds = formData.get("categoryIds")?.toString().split(",") ?? [];

  const values = {
    name: formData.get("name"),
    description: formData.get("description"),
    supplierId: formData.get("supplierId"),
    categoryIds,
    price: Number(formData.get("price")),
    currency: formData.get("currency"),
    quantity: Number(formData.get("quantity")),
  };

  const response = await fetchApi<PrismaProduct>(`/api/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  });

  if (response.success) {
    revalidatePath("/dashboard/products");
  }

  return {
    ...response,
    data: response.success ? { ...response.data, categoryIds } : undefined,
  } as ApiResponse<Product>;
} 