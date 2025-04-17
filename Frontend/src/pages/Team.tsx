import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import TeamLayout from "@/components/team-layout"
import { SiteHeader } from "@/components/site-header"


export default function Dashboard() {
  const showMonthRangePicker = false
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
      <SiteHeader showMonthRangePicker={showMonthRangePicker} />
          <TeamLayout />
      </SidebarInset>
    </SidebarProvider>
  )
}
