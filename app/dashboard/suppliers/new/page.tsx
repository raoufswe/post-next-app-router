import { SupplierForm } from "@/components/dashboard/suppliers/form";
import { createSupplier } from "@/lib/actions/suppliers";

export default function NewSupplierPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">New Supplier</h1>
      <div className="rounded-md border p-4">
        <SupplierForm onSubmit={createSupplier} />
      </div>
    </div>
  );
}
