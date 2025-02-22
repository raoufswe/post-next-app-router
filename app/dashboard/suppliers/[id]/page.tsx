import { SupplierForm } from "@/components/dashboard/suppliers/form";
import { ErrorFallback } from "@/components/dashboard/error-fallback";
import { fetchApi } from "@/lib/fetch";
import type { Supplier } from "@prisma/client";
import { updateSupplier } from "@/lib/actions/suppliers";

export default async function EditSupplierPage({
  params,
}: {
  params: { id: string };
}) {
  const supplier = await fetchApi<Supplier>(`/api/suppliers/${params.id}`);

  if (!supplier.success) {
    return <ErrorFallback error={supplier.error} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Supplier</h1>
      <div className="rounded-md border p-4">
        <SupplierForm
          defaultData={supplier.data}
          onSubmit={updateSupplier.bind(null, params.id)}
        />
      </div>
    </div>
  );
}
