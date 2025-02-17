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
import { PlusCircle } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { type Supplier } from "@prisma/client";

async function getSuppliers() {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;
  const { getToken } = await auth();
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/suppliers?projectId=${projectId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch suppliers");
  }

  return res.json();
}

export default async function SuppliersPage() {
  const suppliers: Supplier[] = await getSuppliers();

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
    </div>
  );
}
