import React, { useState, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

interface SensorData {
  Date: string;       // ISO UTC string
  pH: number;
  TDS: number;
  Temperature: number;
}

interface DashboardChartProps {
  data: SensorData[];
  hoursRange: number;
}

export function DashboardChart({
  data,
  hoursRange,
}: DashboardChartProps) {
  const [activeLine, setActiveLine] = useState<string | null>(null);
  const HOUR = 60 * 60 * 1000;

  // attach timestamp
  const timedData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        timestamp: new Date(d.Date).getTime(),
      })),
    [data]
  );

  // X-domain: last N hours
  const lastTs = timedData.length
    ? timedData[timedData.length - 1].timestamp
    : Date.now();
  const domain: [number, number] = useMemo(
    () => [lastTs - (hoursRange - 1) * HOUR, lastTs],
    [lastTs, hoursRange]
  );

  // pick ~12 ticks max
  const MAX_TICKS = 12;
  const step = Math.max(1, Math.ceil(hoursRange / MAX_TICKS));
  const ticks = useMemo(
    () =>
      Array.from(
        { length: Math.ceil(hoursRange / step) + 1 },
        (_, i) => domain[0] + i * step * HOUR
      ),
    [domain, hoursRange]
  );

  const handleLineClick = (line: string) => {
    setActiveLine(activeLine === line ? null : line);
  };

  const getYDomainFor = (
    key: "pH" | "TDS" | "Temperature"
  ): [number, number] => {
    const vals = data.map((d) => d[key]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    return [min - 1, max + 1];
  };

  const globalYDomain = (): [number, number] => {
    const all = [
      ...data.map((d) => d.pH),
      ...data.map((d) => d.TDS),
      ...data.map((d) => d.Temperature),
    ];
    const min = Math.min(...all);
    const max = Math.max(...all);
    return [min - 1, max + 1];
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row border-b p-0">
        <div className="flex-1 px-6 py-4">
          <CardTitle>Recent Readings</CardTitle>
          <CardDescription>
            Data for the last {hoursRange} hours
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-5 sm:p-4">
        <ChartContainer config={{}} className="h-[515px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timedData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={domain}
                ticks={ticks}
                tickFormatter={(ts) => {
                  const d = new Date(ts);
                  const h = d.getUTCHours().toString().padStart(2, "0");
                  return `${h}:00`;
                }}
                interval={0}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <YAxis
                domain={
                  activeLine
                    ? getYDomainFor(activeLine as any)
                    : globalYDomain()
                }
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md shadow-lg min-w-[160px]">
                      <div className="text-xs text-gray-300 mb-1">
                        {new Date(label as number)
                          .toISOString()
                          .replace("T", " ")
                          .replace("Z", " UTC")}
                      </div>
                      {payload.map((p) => (
                        <div
                          key={p.dataKey as string}
                          className="flex items-center text-sm mb-1"
                        >
                          <span
                            className="inline-block w-3 h-3 rounded-sm mr-2"
                            style={{ backgroundColor: p.stroke as string }}
                          />
                          <span className="font-medium mr-1">{p.name}</span>
                          <span className="ml-auto">{p.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />

              <Legend
                onClick={(e) => handleLineClick(e.value)}
                wrapperStyle={{ padding: "15px 0" }}
                iconType="line"
                formatter={(val) => <span>{val}</span>}
              />

              {(!activeLine || activeLine === "pH") && (
                <Line
                  type="monotone"
                  dataKey="pH"
                  stroke="#ff7300"
                  strokeWidth={3}
                  dot={false}
                />
              )}
              {(!activeLine || activeLine === "TDS") && (
                <Line
                  type="monotone"
                  dataKey="TDS"
                  stroke="#387908"
                  strokeWidth={3}
                  dot={false}
                />
              )}
              {(!activeLine || activeLine === "Temperature") && (
                <Line
                  type="monotone"
                  dataKey="Temperature"
                  stroke="#00c49f"
                  strokeWidth={3}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
