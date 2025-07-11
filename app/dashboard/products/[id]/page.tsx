import { ProductForm } from "@/components/dashboard/products/form";
import { ErrorFallback } from "@/components/dashboard/error-fallback";
import { fetchApi } from "@/lib/fetch";
import type { Product as PrismaProduct, Supplier } from "@prisma/client";
import { updateProduct } from "@/lib/actions/products";
import { cookies } from "next/headers";

type Product = PrismaProduct & {
  categoryIds: string[];
};

export default async function EditProductPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  const [product, suppliers, categories] = await Promise.all([
    fetchApi<Product>(`/api/products/${params.id}`),
    fetchApi<Supplier[]>(`/api/suppliers?projectId=${projectId}`),
    fetchApi<{ id: string; name: string }[]>(
      `/api/categories?projectId=${projectId}`
    ),
  ]);

  if (!product.success) {
    return <ErrorFallback error={product.error} />;
  }

  if (!suppliers.success) {
    return <ErrorFallback error={suppliers.error} />;
  }

  if (!categories.success) {
    return <ErrorFallback error={categories.error} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <div className="rounded-md border p-4">
        <ProductForm
          defaultData={product.data}
          suppliers={suppliers.data}
          categories={categories.data}
          onSubmit={updateProduct.bind(null, params.id)}
        />
      </div>
    </div>
  );
}
