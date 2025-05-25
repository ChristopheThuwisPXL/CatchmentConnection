import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export function ChartAreaInteractive({ data }: { data: any[] }) {
  const [activeLine, setActiveLine] = useState<string | null>(null);

  const handleLineClick = (line: string) => {
    setActiveLine(activeLine === line ? null : line);
  };

  const selectedYear = data.length > 0 ? new Date(data[0].Date).getFullYear() : "";
  const getYDomainForLine = (line: string) => {
    const lineData = data.map(item => item[line]);
    const min = Math.min(...lineData);
    const max = Math.max(...lineData);
    return [min, max];
  };
  const getGlobalYDomain = () => {
    const allData = [
      ...data.map(item => item.pH),
      ...data.map(item => item.TDS),
      ...data.map(item => item.Temperature),
      ...data.map(item => item.EC)
    ];
    const min = Math.min(...allData);
    const max = Math.max(...allData);
    return [min - 1, max + 1];
  };
  const handleLegendClick = (e: { value: string }) => {
    handleLineClick(e.value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-1">
          <CardTitle>Monthly Averages</CardTitle>
          <CardDescription>Historical data for pH, TDS, Temperature, and EC for {selectedYear}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-5 sm:p-§">
        <ChartContainer config={{}} className="aspect-auto h-[515px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              key={activeLine}
              data={data}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="Date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleString("default", { month: "short" })
                }
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend 
                onClick={handleLegendClick}
                wrapperStyle={{ padding: '15px 0' }}
                iconType="line"
                formatter={(value) => {
                  return <span>{value}</span>;
                }}
              />
              <YAxis
                domain={activeLine ? getYDomainForLine(activeLine) : getGlobalYDomain()}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              {(!activeLine || activeLine === "pH") && (
                <Line
                  type="monotone"
                  dataKey="pH"
                  stroke="#ff7300"
                  strokeWidth={3}
                  dot={false}
                  onClick={() => handleLineClick("pH")}
                />
              )}
              {(!activeLine || activeLine === "TDS") && (
                <Line
                  type="monotone"
                  dataKey="TDS"
                  stroke="#387908"
                  strokeWidth={3}
                  dot={false}
                  onClick={() => handleLineClick("TDS")}
                />
              )}
              {(!activeLine || activeLine === "Temperature") && (
                <Line
                  type="monotone"
                  dataKey="Temperature"
                  stroke="#00c49f"
                  strokeWidth={3}
                  dot={false}
                  onClick={() => handleLineClick("Temperature")}
                />
              )}
              {(!activeLine || activeLine === "EC") && (
                <Line
                  type="monotone"
                  dataKey="EC"
                  stroke="#8c3c9c"
                  strokeWidth={3}
                  dot={false}
                  onClick={() => handleLineClick("EC")}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
