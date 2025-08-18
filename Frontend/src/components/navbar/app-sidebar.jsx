import { useAuth } from "@/context/AuthContext";
import { NavMain } from "@/components/navbar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "../ui/nav-user";
import NavSecondary from "@/components/ui/nav-secondary";
import { buildNavData } from "./NavData";

export function AppSidebar({ ...props }) {
  const { user } = useAuth(); // <-- real auth state
  const nav = buildNavData(user); // <-- dynamic data
  const isLoggedIn = !!user;

  // optional: while hydrating session (if user === undefined in your context), render nothing or a slim loader

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="flex justify-center flex-col">
        <NavMain items={nav} />
      </SidebarContent>

      <SidebarFooter>
        {isLoggedIn && nav.user && <NavUser user={nav.user} />}
        {!isLoggedIn && <NavSecondary items={nav.authBtn} />}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
