import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function YearPicker({ onSelect }: { onSelect: (year: number) => void }) {
  const [selectedYear, setSelectedYear] = React.useState<number>();
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);

  const yearsPerPage = 10;
  const startYear = 2000;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);

  const handleSelect = (year: number) => {
    setSelectedYear(year);
    onSelect(year);
    setOpen(false);
  };

  const paginatedYears = years.slice(page * yearsPerPage, (page + 1) * yearsPerPage);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[180px] justify-start text-left font-normal",
            !selectedYear && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedYear ? selectedYear : "Pick a year"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-2 gap-2 mb-2">
          {paginatedYears.map((year) => (
            <Button key={year} variant="ghost" onClick={() => handleSelect(year)}>
              {year}
            </Button>
          ))}
        </div>
        <div className="flex justify-between">
          <Button variant="ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <Button
            variant="ghost"
            disabled={(page + 1) * yearsPerPage >= years.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}


