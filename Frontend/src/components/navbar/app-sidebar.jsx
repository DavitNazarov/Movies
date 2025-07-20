import { useState } from "react";

import { NavMain } from "@/components/navbar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "../ui/nav-user";
import NavSecondary from "@/components/ui/nav-secondary";
import { data } from "./NavData";

export function AppSidebar({ ...props }) {
  //! permanent state ( before real Auth system )
  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="flex justify-center flex-col">
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>
        {/* User info */}
        {IsLoggedIn && <NavUser user={data.user} />}
        {/*Auth buttons  */}
        {!IsLoggedIn && <NavSecondary items={data.authBtn} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
