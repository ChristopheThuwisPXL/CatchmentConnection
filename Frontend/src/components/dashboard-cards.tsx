import React, { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { DashboardChart } from "@/components/dashboard-chart";
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { PolarAngleAxis } from 'recharts';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface SensorData {
  Date: string;         // ISO UTC from backend
  pH: number;
  TDS: number;
  Temperature: number;
  status?: string;
  location?: { latitude: number; longitude: number };
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}

export function SectionCards() {
  const [hoursRange, setHoursRange] = useState<number>(72);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [chartData, setChartData] = useState<SensorData[]>([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const latestRes = await axios.get<SensorData[]>("http://localhost:5000/getSensorData");
      const latest = latestRes.data[0];
      setSensorData(latest ?? null);

      const historyRes = await axios.get<SensorData[]>(`http://localhost:5000/getSensorData?hours=${hoursRange}`);
      setChartData(historyRes.data);
    } catch (err) {
      console.error("Failed to fetch sensor data:", err);
    }
  };
  fetchData();
}, [hoursRange]);


  if (!sensorData) return <div>Loading...</div>;

  const {
    pH,
    TDS,
    Temperature,
    status,
  } = sensorData;
  const isOnline = status === "Online";

  const metrics = [
    { label: "pH", value: pH },
    { label: "TDS", value: TDS },
    { label: "Temperature", value: Temperature },
    { label: "EC", value: 0},
  ];

  const maxValues: Record<string, number> = {
    pH: 12,
    TDS: 1000,
    Temperature: 30,
    EC: 150,
  };

  const metricColors: Record<string, string> = {
    pH: "#ff7300",
    TDS: "#387908",
    Temperature: "#00c49f",
    EC: "#8c3c9c",
  };

const getUnit = (label: string): string => {
  switch (label.toLowerCase()) {
    case "temperature":
      return "°C";
    case "tds":
      return "ppm";
    case "ec":
      return "µS/cm";
    default:
      return "";
  }
};


  return (
    <div className="w-full flex flex-col items-center px-2 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
        {metrics.map(({ label, value }) => {
          const normalizedValue = value / maxValues[label];
          const filteredChartData = chartData.map((d) => ({
            Date: d.Date,
            value: d[label],
          }));

          return (
            <Popover key={label}>
              <PopoverTrigger asChild>
                <Card   className="
                        shadow-xs w-full no-padding cursor-pointer
                        transition-transform duration-200
                        hover:scale-[1.05] hover:shadow-md
                      ">
                  <div className="relative">
                    <div className="absolute right-4 top-4">
                      <Badge
                        variant="outline"
                        className={`flex gap-1 rounded-lg text-xs ${
                          isOnline
                            ? "border-green-500 text-green-500"
                            : "border-red-500 text-red-500"
                        }`}
                      >
                        {isOnline ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Online
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" /> Offline
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="relative !p-0">
                    <ChartContainer
                      config={{ [label]: { label } }}
                      className="mx-auto w-[160px] aspect-square mb-3"
                    >
                      <RadialBarChart
                        data={[{ name: label, value: normalizedValue }]}
                        startAngle={270}
                        endAngle={-90}
                        innerRadius={90}
                        outerRadius={70}
                        margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                      >
                        <PolarGrid gridType="circle" radialLines={false} stroke="none" />
                        <PolarAngleAxis
                          type="number"
                          domain={[0, 1]}
                          angleAxisId={0}
                          tick={false}
                        />
                        <RadialBar
                          dataKey="value"
                          angleAxisId={0}
                          background
                          fill={metricColors[label]}
                          cornerRadius={10}
                        />
                      </RadialBarChart>
                    </ChartContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="text-2xl font-bold text-foreground">
                        {value.toFixed(2)}{" "}
                        <span className="text-sm align-top">{getUnit(label)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{label}</div>
                    </div>
                  </CardContent>
                </Card>
              </PopoverTrigger>

              <PopoverContent className="w-120">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={filteredChartData.map((d) => ({
                      Date: d.Date,
                      value: d.value,
                    }))}
                    margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                  >
                    <XAxis
                      dataKey="Date"
                      tickFormatter={(d) =>
                        new Date(d).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;

                        return (
                          <div className="bg-gray-900 text-gray-100 p-3 rounded-md shadow-lg min-w-[160px]">
                            <div className="text-xs text-gray-300 mb-1">
                              {new Date(label as string).toLocaleString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
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
                                  <span className="ml-auto">
                                    {(p.value as number).toFixed(2)}{" "}
                                    {typeof p.name === "string" ? getUnit(p.name) : ""}
                                  </span>
                              </div>
                            ))}
                          </div>
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={metricColors[label] || "#8884d8"}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                      name={label}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-2 text-sm text-muted-foreground text-center">
                  {label} trend (last 72h)
                </div>
              </PopoverContent>
            </Popover>
          
        );
      })}
      </div>


      {/* Chart + Dropdown */}
      <div className="relative w-full max-w-full mb-8">
        AI stuff coming soon...
      </div>
    </div>
  );
}

