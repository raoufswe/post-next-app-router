import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, FolderTree } from "lucide-react";
import { CategoryRow } from "@/components/dashboard/categories/category-row";
import { cookies } from "next/headers";
import { fetchApi } from "@/lib/fetch";
import { type Category } from "@prisma/client";
import { ErrorFallback } from "@/components/dashboard/error-fallback";
import { EmptyState } from "@/components/dashboard/empty-state";

async function getCategories() {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  const response = await fetchApi<Category[]>(
    `/api/categories?projectId=${projectId}`
  );

  return response;
}

export default async function CategoriesPage() {
  const response = await getCategories();

  if (!response.success) {
    return <ErrorFallback error={response.error} />;
  }

  const categories = response.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button asChild>
          <Link href="/dashboard/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      {!categories?.length ? (
        <EmptyState
          title="No categories"
          description="Add your first category to get started."
          icon={FolderTree}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <CategoryRow key={category.id} category={category} level={0} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
