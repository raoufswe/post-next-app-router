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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: {
    projects: Project[];
    selectedProject: Project;
    user: User & {
      projects: Project[];
    };
  };
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
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
