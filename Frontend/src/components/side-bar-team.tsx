import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import logo from "@/assets/Images/logo copy.png"

export function TeamSwitcher(){
  return (
    <SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-11 items-center justify-center text-sidebar-primary-foreground">
              <img src={logo} alt="Catchment Logo" className="h-full w-full object-cover translate-x-[-15%]" />
              </div>
              <div className="grid flex-1 text-left text-base leading-tight -ml-3">
                <span className="truncate font-semibold">
                  Catchment
                </span>
                <span className="truncate font-semibold">
                  Connection
                </span>
              </div>
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
