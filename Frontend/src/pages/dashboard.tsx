import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Dashboard() {
  const showMonthRangePicker = false;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader showMonthRangePicker={showMonthRangePicker} />
      </SidebarInset>
    </SidebarProvider>
  )
}
