import * as React from "react";
import {
  LayoutDashboardIcon,
  BarChartIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/side-bar-team";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useUser } from "@/hooks/useUser";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
    isActive: true,
  },
  {
    title: "History",
    url: "/history",
    icon: BarChartIcon,
  },
  {
    title: "Team",
    url: "/team",
    icon: UsersIcon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <HoverCard>
          <HoverCardTrigger>
            <TeamSwitcher />
          </HoverCardTrigger>
          <HoverCardContent>
            created and maintained by Trent Evans, Calvin Nijenhuis & Christophe Thuwis.
          </HoverCardContent>
        </HoverCard>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser user={user} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
