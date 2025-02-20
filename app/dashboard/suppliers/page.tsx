import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, Building2 } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { cookies } from "next/headers";
import { type Supplier } from "@prisma/client";
import { fetchApi } from "@/lib/fetch";
import { ErrorFallback } from "@/components/dashboard/error-fallback";
import { EmptyState } from "@/components/dashboard/empty-state";

async function getSuppliers() {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  const response = await fetchApi<Supplier[]>(
    `/api/suppliers?projectId=${projectId}`
  );

  return response;
}

export default async function SuppliersPage() {
  const response = await getSuppliers();

  if (!response.success) {
    return <ErrorFallback error={response.error} />;
  }

  const suppliers = response.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Button asChild>
          <Link href="/dashboard/suppliers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Supplier
          </Link>
        </Button>
      </div>

      {!suppliers?.length ? (
        <EmptyState
          title="No suppliers"
          description="Add your first supplier to get started."
          icon={Building2}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.description}</TableCell>
                  <TableCell>{supplier.slug}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/suppliers/${supplier.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <DeleteDialog
                      id={supplier.id}
                      name={supplier.name}
                      url="/api/suppliers"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
