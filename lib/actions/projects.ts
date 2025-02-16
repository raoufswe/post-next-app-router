'use server'

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CreateProjectInput } from "@/lib/schemas/project";

export async function createProject(data: CreateProjectInput) {
  const { getToken } = await auth();
  const token = await getToken();

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

