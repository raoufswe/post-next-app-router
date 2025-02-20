'use server'

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchApi } from "@/lib/fetch";
import type { CreateProjectInput } from "@/lib/schemas/project";

export async function createProject(data: CreateProjectInput) {
  await fetchApi('/api/projects', {
    method: "POST",
    body: JSON.stringify(data),
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

