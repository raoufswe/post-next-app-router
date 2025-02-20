import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { fetchApi } from "@/lib/fetch";
import { type User, type Project } from "@prisma/client";
import { ErrorFallback } from "@/components/dashboard/error-fallback";

type UserWithProjects = User & {
  projects: Project[];
};

async function getUserData() {
  const cookieStore = await cookies();
  const response = await fetchApi<UserWithProjects>("/api/users/me");

  if (!response.success) return response;

  const userData = response.data;

  if (!userData.projects?.length) {
    redirect("/onboarding");
  }

  const selectedProjectId = cookieStore.get("selectedProjectId")?.value;
  const selectedProject =
    userData.projects.find((p: Project) => p.id === selectedProjectId) ??
    userData.projects[0];

  if (!selectedProjectId) {
    cookieStore.set("selectedProjectId", selectedProject.id, { path: "/" });
  }

  return {
    ...response,
    data: {
      projects: userData.projects,
      selectedProject,
      user: userData,
    },
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await getUserData();

  return (
    <SidebarProvider>
      <AppSidebar
        data={response.success ? response.data : undefined}
        disabled={!response.success}
      />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {response.success ? (
            children
          ) : (
            <ErrorFallback error={response.error} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
