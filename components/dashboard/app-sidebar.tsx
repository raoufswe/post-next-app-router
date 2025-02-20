"use client";

import * as React from "react";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { ProjectSwitcher } from "@/components/dashboard/project-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Project, User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

interface AppSidebarProps {
  data?: {
    projects: Project[];
    selectedProject: Project;
    user: User;
  };
  disabled?: boolean;
}

export function AppSidebar({ data, disabled }: AppSidebarProps) {
  if (disabled || !data) {
    return (
      <Sidebar collapsible="icon" className="opacity-50">
        <SidebarHeader>
          <div className="px-4 py-2">
            <Skeleton className="h-7 w-full mb-1" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="space-y-1 px-4 py-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-[85%]" />
            <Skeleton className="h-9 w-[90%]" />
          </div>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-4 py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ProjectSwitcher
          projects={data.projects}
          selectedProject={data.selectedProject}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
