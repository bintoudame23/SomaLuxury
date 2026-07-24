import type { Metadata } from "next";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

import { ClerkProvider } from "@clerk/nextjs";

import "../globals.css";
import "remixicon/fonts/remixicon.css";


export const metadata: Metadata = {
  title: "ADMIN SOMA LUXURY",
  description: "Administration Soma Luxury",
};


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/sign-in"
      
       signInFallbackRedirectUrl="/admin/dashboard"
       signUpFallbackRedirectUrl="/admin/dashboard"
    >

      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >

        <AppSidebar variant="inset" />

        <SidebarInset>

          <SiteHeader />

          <div className="flex flex-1 flex-col">

            <div className="@container/main flex flex-1 flex-col gap-2">

              <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">

                {children}

              </div>

            </div>

          </div>

        </SidebarInset>


      </SidebarProvider>


    </ClerkProvider>

  );
}