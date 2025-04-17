import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import YearPicker from "./year-filter"
import { ThemeProvider } from "./theme-provider"
import { ModeToggle } from "./mode-toggle"
import { Github } from "@/components/ui/github"

export function SiteHeader({ showYearPicker, onYearSelect }: { showYearPicker: boolean, onYearSelect?: (year: number) => void }) {
  return (
    <ThemeProvider>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <h1 className="text-base font-medium"></h1>
          <div className="ml-auto flex items-center space-x-2">
            {showYearPicker && onYearSelect && <YearPicker onSelect={onYearSelect} />}
            <Github/>
            <ModeToggle  />
          </div>
        </div>
      </header>
    </ThemeProvider>
  )
}

