import { ProductForm } from "@/components/dashboard/products/form";
import { createProduct } from "@/lib/actions/products";
import { fetchApi } from "@/lib/fetch";
import type { Supplier } from "@prisma/client";
import { cookies } from "next/headers";
import { ErrorFallback } from "@/components/dashboard/error-fallback";

export default async function NewProductPage() {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  const [suppliers, categories] = await Promise.all([
    fetchApi<Supplier[]>(`/api/suppliers?projectId=${projectId}`),
    fetchApi<{ id: string; name: string }[]>(
      `/api/categories?projectId=${projectId}`
    ),
  ]);

  if (!suppliers.success) {
    return <ErrorFallback error={suppliers.error} />;
  }

  if (!categories.success) {
    return <ErrorFallback error={categories.error} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">New Product</h1>
      <div className="rounded-md border p-4">
        <ProductForm
          suppliers={suppliers.data}
          categories={categories.data}
          onSubmit={createProduct}
        />
      </div>
    </div>
  );
}
