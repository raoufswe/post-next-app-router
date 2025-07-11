import { CategoryForm } from "@/components/dashboard/categories/form";
import { ErrorFallback } from "@/components/dashboard/error-fallback";
import { fetchApi } from "@/lib/fetch";
import type { Category } from "@prisma/client";
import { updateCategory } from "@/lib/actions/categories";

export default async function EditCategoryPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const id = await params.id;
  const category = await fetchApi<Category>(`/api/categories/${id}`);

  if (!category.success) {
    return <ErrorFallback error={category.error} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Category</h1>
      <div className="rounded-md border p-4">
        <CategoryForm
          defaultData={category.data}
          onSubmit={updateCategory.bind(null, id)}
        />
      </div>
    </div>
  );
}
