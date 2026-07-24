"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar"
import {

  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconSettings,
  IconShoppingCart,
  IconReportAnalytics,


} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
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
  
  navMain: [
  
    {
      section: "E-Commerce",
      items: [
        { title: "Add New Product", url: "/admin/produit", icon: IconListDetails },
        { title: "Catégories", url: "/admin/categories", icon: IconFolder },
        { title: "Commandes", url: "/admin/commandes", icon: IconShoppingCart },
        {title: "statistiques", url: "/admin/stats", icon: IconReportAnalytics},
  
      ],
    },
   
    {
      section: "System",
      items: [
       
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
      </SidebarFooter>
    </Sidebar>
  );
}



 