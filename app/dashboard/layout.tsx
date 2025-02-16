import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

async function getUserData() {
  const cookieStore = await cookies();
  const { getToken } = await auth();
  const token = await getToken();

  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/users/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const userData = await userResponse.json();
  if (!userData.projects?.length) {
    redirect("/onboarding");
  }

  const selectedProjectId = cookieStore.get("selectedProjectId")?.value;
  const selectedProject =
    userData.projects.find((p) => p.id === selectedProjectId) ??
    userData.projects[0];

  if (!selectedProjectId) {
    cookieStore.set("selectedProjectId", selectedProject.id, { path: "/" });
  }

  return {
    projects: userData.projects,
    selectedProject,
    user: userData,
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getUserData();

  return (
    <SidebarProvider>
      <AppSidebar data={data} />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
