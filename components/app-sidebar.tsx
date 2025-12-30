"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar"
import {
  IconChartBar,
  IconClipboardList,
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconTable,
  IconTableAlias,
  IconTableColumn,
  IconTableDashed,
  IconTableDown,
  IconTableExport,
  IconUsers,
  IconSettings,
  IconShoppingCart,
  IconTrendingUp,
  IconReportAnalytics,
  IconWorldSearch,
  IconMessage,
  IconCalendarWeek

} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";


const data = {
  user: {
    name: "bintoudame23",
    email: "fasylla2003@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      section: "Dashboard",
      items: [
  
        { title: "Overview", url: "/admin/dashboard", icon: IconDashboard },
        { title: "Reports", url: "/admin/reports", icon: IconReportAnalytics },
      
      ],
    },
    {
      section: "E-Commerce",
      items: [
        { title: "Produits", url: "/admin/produit", icon: IconListDetails },
        { title: "Catégories", url: "/admin/categories", icon: IconFolder },
        { title: "Commandes", url: "/admin/commandes", icon: IconShoppingCart },
        { title: "Stock", url: "/admin/stock", icon: IconTable },
        { title: "SupportContact", url: "/admin/support", icon: IconMessage },
      ],
    },
    {
      section: "Users",
      items: [
        { title: "Team", url: "/admin/team", icon: IconUsers },
        { title: "Roles & Permissions", url: "/admin/roles", icon: IconTableAlias },
        { title: "AddEmploye", url: "/admin/addEmploye", icon: IconWorldSearch },
      ],
    },
    {
      section: "System",
      items: [
       
        { title: "Tableau Manager", url: "/admin/tableau", icon: IconTableAlias },
        { title: "Settings", url: "/admin/settings", icon: IconSettings },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Main Menu</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Calendar/>

      <SidebarContent>
        {data.navMain.map((group, index) => (
          <div key={index} className="mt-4 px-3">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{group.section}</p>
            <NavMain items={group.items} />
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}



 