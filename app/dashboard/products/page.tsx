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
import { PlusCircle, Package2 } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { cookies } from "next/headers";
import { type Product, type Supplier } from "@prisma/client";
import { fetchApi } from "@/lib/fetch";
import { ErrorFallback } from "@/components/dashboard/error-fallback";
import { EmptyState } from "@/components/dashboard/empty-state";

type ProductWithSupplier = Product & {
  supplier: Supplier;
};

async function getProducts() {
  const cookieStore = await cookies();
  const projectId = cookieStore.get("selectedProjectId")?.value;

  const response = await fetchApi<ProductWithSupplier[]>(
    `/api/products?projectId=${projectId}`
  );

  return response;
}

export default async function ProductsPage() {
  const response = await getProducts();

  if (!response.success) {
    return <ErrorFallback error={response.error} />;
  }

  const products = response.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {!products?.length ? (
        <EmptyState
          title="No products"
          description="Add your first product to get started."
          icon={Package2}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    {product.price} {product.currency}
                  </TableCell>
                  <TableCell>{product.supplier.name}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/products/${product.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <DeleteDialog
                      id={product.id}
                      name={product.name}
                      url="/api/products"
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
