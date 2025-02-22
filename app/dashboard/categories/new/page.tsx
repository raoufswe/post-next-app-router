import { CategoryForm } from "@/components/dashboard/categories/form";
import { createCategory } from "@/lib/actions/categories";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">New Category</h1>
      <div className="rounded-md border p-4">
        <CategoryForm onSubmit={createCategory} />
      </div>
    </div>
  );
}
