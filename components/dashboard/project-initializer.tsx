"use client";

import { useEffect } from "react";
import { setSelectedProject } from "@/lib/actions/projects";
import { usePathname, useRouter } from "next/navigation";

interface ProjectInitializerProps {
  selectedProjectId: string | undefined;
  defaultProjectId: string;
}

export function ProjectInitializer({
  selectedProjectId,
  defaultProjectId,
}: ProjectInitializerProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeProject = async () => {
      if (!selectedProjectId) {
        await setSelectedProject(defaultProjectId);
        router.replace(pathname);
      }
    };

    initializeProject();
  }, [selectedProjectId, defaultProjectId, router, pathname]);

  return null;
}
