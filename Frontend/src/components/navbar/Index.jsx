import React from "react";
import { AppSidebar } from "@/components/navbar/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { BreadCrumb } from "../ui/BreadCrumb.index";
import { ScrollArea } from "../ui/scroll-area";

const Index = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 " />
          <BreadCrumb />
        </header>

        <ScrollArea className="h-[calc(100dvh-4rem)] w-full">
          <section>
            <Outlet />
          </section>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Index;
