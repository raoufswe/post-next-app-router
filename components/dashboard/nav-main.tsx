"use client";

import {
  Package,
  Building,
  LayoutGrid,
  ShoppingCart,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    name: "Products",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    name: "Suppliers",
    url: "/dashboard/suppliers",
    icon: Building,
  },
  {
    name: "Categories",
    url: "/dashboard/categories",
    icon: LayoutGrid,
  },
  {
    name: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={cn(pathname === item.url && "bg-accent")}
            >
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
