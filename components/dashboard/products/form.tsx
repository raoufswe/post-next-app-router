"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { type Product as PrismaProduct, type Supplier } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import type { ApiResponse } from "@/lib/fetch";
import ReactSelect from "react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor/rich-text-editor";
import FileUploader from "@/components/ui/file-uploader";
import { Descendant } from "slate";
import { FilePondFile } from "filepond";
const defaultDescription = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

type Product = PrismaProduct & {
  categoryIds: string[];
};

type Option = {
  value: string;
  label: string;
};

function SubmitButton({ defaultData }: { defaultData?: Product | null }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Loading..." : defaultData ? "Update" : "Create"}
    </Button>
  );
}

interface ProductFormProps {
  defaultData?: Product | null;
  suppliers: Supplier[];
  categories: { id: string; name: string }[];
  onSubmit: (formData: FormData) => Promise<ApiResponse<Product>>;
}

export function ProductForm({
  defaultData,
  suppliers,
  categories,
  onSubmit,
}: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    defaultData?.categoryIds
      ?.map((id) => {
        const category = categories.find((c) => c.id === id);
        return category ? { value: category.id, label: category.name } : null;
      })
      .filter((x): x is Option => x !== null) ?? []
  );
  const [description, setDescription] = useState(
    Array.isArray(defaultData?.description)
      ? defaultData.description
      : defaultDescription
  );
  const [mediaFiles, setMediaFiles] = useState<FilePondFile[]>([]);

  async function handleAction(formData: FormData) {
    const mediaFileUrls = (mediaFiles ?? [])
      .map((file: FilePondFile) => file.getFileEncodeDataURL())
      .filter(Boolean);
    formData.append("mediaFiles", JSON.stringify(mediaFileUrls));

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
      description: `Product ${
        defaultData ? "updated" : "created"
      } successfully.`,
    });
    router.push("/dashboard/products");
    router.refresh();
  }

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <form action={handleAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultData?.name}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description">Description</label>
        <input
          type="hidden"
          name="description"
          value={JSON.stringify(description)}
        />
        <RichTextEditor
          value={description as Descendant[]}
          onChange={setDescription}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="supplierId">Supplier</label>
        <Select name="supplierId" defaultValue={defaultData?.supplierId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="categoryIds">Categories</label>
        <input
          type="hidden"
          name="categoryIds"
          id="categoryIds"
          value={selectedOptions.map((opt) => opt.value).join(",")}
        />
        <ReactSelect<Option, true>
          isMulti
          options={categoryOptions}
          value={selectedOptions}
          onChange={(newValue) => {
            const newSelected = Array.from(newValue || []);
            setSelectedOptions(newSelected);
            const input = document.getElementById(
              "categoryIds"
            ) as HTMLInputElement;
            if (input) {
              input.value = newSelected.map((opt) => opt.value).join(",");
            }
          }}
          placeholder="Select categories"
          className="react-select"
          classNamePrefix="react-select"
          isClearable={true}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="media">Media</label>
        <FileUploader
        //@ts-expect-error files prop is not defined in FilePondHookProps
          files={mediaFiles}
          onupdatefiles={setMediaFiles}
          allowMultiple={true}
          acceptedFileTypes={["image/*"]}
          labelIdle='Drag & Drop product images or <span class="filepond--label-action">Browse</span>'
        />
      </div>

      <div className="flex gap-4">
        <SubmitButton defaultData={defaultData} />
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
