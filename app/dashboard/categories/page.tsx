import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { CategoryRow } from "@/components/dashboard/categories/category-row";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
async function getCategories() {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;
  const { getToken } = await auth();
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/categories?projectId=${projectId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

export default async function CategoriesPage() {
  const categories = await getCategories();

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
    </div>
  );
}
