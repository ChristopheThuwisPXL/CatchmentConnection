import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SectionCards } from "@/components/dashboard-cards";
import { DashboardChart } from "@/components/prediction-chart";
import { AnalysisCharts } from "@/components/analysis-chart"

export default function Dashboard() {
  const showYearPicker = false;
  
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader showYearPicker={showYearPicker} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
               <SectionCards/>
                <DashboardChart/>
               <AnalysisCharts/>

            </div>
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}
