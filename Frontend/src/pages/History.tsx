import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useHistoricalData } from "@/hooks/useHistoricalData";

export default function History() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { currentData, previousData } = useHistoricalData(selectedYear || 2024);
  useEffect(() => {
    if (selectedYear === null) {
      setSelectedYear(2024);
    }
  }, [selectedYear]);
  const filteredCurrentData = currentData.filter((data: any) => new Date(data.Date).getFullYear() === selectedYear);
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader showYearPicker={true} onYearSelect={setSelectedYear} showDateTime={false} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards data={currentData} previousData={previousData} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={filteredCurrentData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
