import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { path } from "@/constants/routes.const";
import { useCallback } from "react";

export function NavMain({ items }) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { isMobile, setOpen, setOpenMobile } = useSidebar();

  // open sidebar
  const openSidebar = useCallback(() => {
    if (isMobile) setOpenMobile(true);
    else setOpen(true);
  }, [isMobile, setOpen, setOpenMobile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `${path.search}?q=${encodeURIComponent(q)}` : path.search);
  };

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-5">
        <form onSubmit={handleSubmit} onClick={() => toggleSidebar}>
          <Input
            placeholder="Search Movie..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={openSidebar}
            onClick={openSidebar}
          />
        </form>
        {items.mainLinks.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name}>
              <Link to={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {items.DropDown.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
            onFocus={openSidebar}
            onClick={openSidebar}
          >
            <SidebarMenuItem className="cursor-pointer">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {/*  dropdown */}
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link to={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
