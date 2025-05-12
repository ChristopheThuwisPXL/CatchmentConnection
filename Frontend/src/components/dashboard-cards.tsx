import React, { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { DashboardChart } from "@/components/dashboard-chart";

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
    const fetchSensorData = async () => {
      try {
        const res = await axios.get<SensorData[]>(
          `http://localhost:5000/getSensorData?hours=${hoursRange}`
        );
        const all = res.data;
        setSensorData(all[all.length - 1] ?? null);
        setChartData(all);
      } catch (err) {
        console.error("Failed to fetch sensor data:", err);
      }
    };
    fetchSensorData();
  }, [hoursRange]);

  if (!sensorData) return <div>Loading...</div>;

  const {
    pH,
    TDS,
    Temperature,
    status,
    Date: rawDate,
    location,
    latitude,
    longitude,
  } = sensorData;
  const isOnline = status === "Online";
  const lat = location?.latitude ?? latitude;
  const lng = location?.longitude ?? longitude;

  const metrics = [
    { label: "pH", value: pH },
    { label: "TDS", value: TDS },
    { label: "Temperature", value: Temperature },
  ];

  return (
    <div className="w-full flex flex-col items-center px-4 lg:px-8">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8">
        {metrics.map(({ label, value }) => (
          <Card key={label} className="shadow-md flex flex-col w-full">
            <CardHeader className="relative flex-grow">
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {typeof value === "number" ? value.toFixed(2) : "N/A"}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge
                  variant="outline"
                  className={`flex gap-1 items-center rounded-lg text-xs ${
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
            </CardHeader>
            <CardFooter className="flex flex-col items-start text-sm">
              <div className="text-muted-foreground mb-1">
                Last updated
              </div>
              <div className="text-sm font-mono flex items-center">
                <span>{new Date(rawDate).toISOString().split("T")[0]}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span>
                  {new Date(rawDate)
                    .toISOString()
                    .split("T")[1]
                    .replace("Z", "")}
                </span>
                <span className="ml-1 text-xs uppercase text-gray-400">
                  UTC
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Chart + Dropdown */}
      <div className="relative w-full max-w-full mb-8">
        <div
          className="
            absolute right-4 top-4 z-20 flex items-center space-x-2
            bg-white bg-opacity-60 text-gray-900
            dark:bg-gray-800 dark:bg-opacity-60 dark:text-gray-100
            px-3 py-1 rounded-md shadow
          "
        >
          <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <select
            value={hoursRange}
            onChange={(e) => setHoursRange(Number(e.target.value))}
            className="
              bg-white text-gray-900
              dark:bg-gray-800 dark:text-gray-100
              px-2 py-1 rounded-md
              appearance-none focus:outline-none
            "
          >
            <option value={1}>Last 1 Hour</option>
            <option value={24}>Last 24 Hours</option>
            <option value={72}>Last 72 Hours</option>
          </select>
        </div>
        <DashboardChart data={chartData} hoursRange={hoursRange} />
      </div>

      {/* Bottom Summary */}
      <Card className="shadow-md w-full mb-8">
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle>Summary of Sensor Data</CardTitle>
          <CardDescription>Quick overview of location &amp; timestamp</CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-wrap items-center gap-6 text-sm px-6 py-4">
          <div>
            <span className="font-semibold">Latitude:</span>
            <span className="ml-2 text-gray-300">{lat ?? "N/A"}</span>
          </div>
          <div>
            <span className="font-semibold">Longitude:</span>
            <span className="ml-2 text-gray-300">{lng ?? "N/A"}</span>
          </div>
          <div>
            <span className="font-semibold">
              Last updated (UTC):
            </span>
            <span className="ml-2 text-gray-300">
              {new Date(rawDate).toISOString().replace("Z", " UTC")}
            </span>
          </div>
        </CardFooter>
      </Card>
  </div>
  );
}
