import * as React from "react";
import { House, Clapperboard, Users } from "lucide-react";

import { NavMain } from "@/components/navbar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/navbar/ui/sidebar";
import { path } from "@/constants/routes.const";

const data = {
  DropDown: [
    {
      title: "All Genres",
      url: path.movies,
      icon: Clapperboard,
      items: [
        {
          title: "Movies",
          url: path.movies,
        },
        {
          title: "Drama",
          url: path.movieDetail,
        },
        {
          title: "Fiction",
          url: "#",
        },
        {
          title: "More",
          url: "#",
        },
      ],
    },
  ],
  mainLinks: [
    {
      name: "Home",
      url: path.home,
      icon: House,
    },
    {
      name: "About",
      url: path.about,
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="flex justify-center flex-col">
        <NavMain items={data} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
