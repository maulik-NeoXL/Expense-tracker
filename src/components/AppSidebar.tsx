"use client";

import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Tags,
  Wallet,
  Nut,
  Building2,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "./ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: CreditCard,
  },
  {
    title: "Income",
    url: "/income",
    icon: TrendingUp,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Tags,
  },
  {
    title: "Sources",
    url: "/sources",
    icon: Building2,
  },
  {
    title: "Budget",
    url: "/budget",
    icon: Wallet,
  },
  {
    title: "AI",
    url: "/ai",
    icon: Sparkles,
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        {/* When expanded: Walnut and collapse button on same line */}
        <div className="flex items-center justify-between group-data-[state=expanded]:flex group-data-[collapsible=icon]:hidden">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Nut className="w-8 h-8" />
                  <span>Walnut</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger />
        </div>
        
        {/* When collapsed: Walnut above, collapse button below */}
        <div className="flex flex-col gap-2 group-data-[collapsible=icon]:flex group-data-[state=expanded]:hidden">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Nut className="w-8 h-8" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex justify-center">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || (item.title === "Home" && pathname === "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
