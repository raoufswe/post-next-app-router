import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
  return (
    <Sidebar collapsible="icon" className="opacity-50">
      <SidebarHeader>
        <div className="h-[48px] px-4 flex items-center">
          <Skeleton className="h-[48px] w-full" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-1 px-4 py-2">
          <Skeleton className="h-[32px] w-full" />
          <Skeleton className="h-[32px] w-[85%]" />
          <Skeleton className="h-[32px] w-[90%]" />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="h-[48px] px-4 flex items-center">
          <Skeleton className="h-[48px] w-full" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
