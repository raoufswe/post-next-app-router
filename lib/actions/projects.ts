'use server'

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchApi } from "@/lib/fetch";
import type { CreateProjectInput } from "@/lib/schemas/project";
import { cookies } from 'next/headers'

export async function createProject(data: CreateProjectInput) {
  await fetchApi('/api/projects', {
    method: "POST",
    body: JSON.stringify(data),
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function setSelectedProject(projectId: string) {
 const cookieStore = await cookies();
 cookieStore.set("selectedProjectId", projectId, { path: "/" });
}
