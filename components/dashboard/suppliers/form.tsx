"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { type Supplier } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import type { ApiResponse } from "@/lib/fetch";

function SubmitButton({ defaultData }: { defaultData?: Supplier | null }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Loading..." : defaultData ? "Update" : "Create"}
    </Button>
  );
}

interface SupplierFormProps {
  defaultData?: Supplier | null;
  onSubmit: (formData: FormData) => Promise<ApiResponse<Supplier>>;
}

export function SupplierForm({ defaultData, onSubmit }: SupplierFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleAction(formData: FormData) {
    const response = await onSubmit(formData);

    if (!response.success) {
      toast({
        title: "Error",
        description: response.error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Supplier ${
        defaultData ? "updated" : "created"
      } successfully.`,
    });
  }

  return (
    <form action={handleAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">Name</label>
        <Input name="name" defaultValue={defaultData?.name} />
      </div>
      <div className="space-y-2">
        <label htmlFor="slug">Slug</label>
        <Input name="slug" defaultValue={defaultData?.slug} />
      </div>
      <div className="space-y-2">
        <label htmlFor="description">Description</label>
        <Textarea
          name="description"
          defaultValue={defaultData?.description ?? ""}
        />
      </div>
      <div className="flex gap-4">
        <SubmitButton defaultData={defaultData} />
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/suppliers")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
