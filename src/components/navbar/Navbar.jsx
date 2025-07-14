import React from "react";
import { AppSidebar } from "@/components/navbar/app-sidebar";

import { Separator } from "@/components/navbar/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/navbar/ui/sidebar";
import { Outlet } from "react-router-dom";
import { BreadCrumb } from "./ui/BreadCrumb.index";

const Navbar = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 " />
          <BreadCrumb />
        </header>
        <main>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Navbar;
