import React, { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export function SectionCards() {
  const [sensorData, setSensorData] = useState<any | null>(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getSensorData");
        setSensorData(res.data[0]);
      } catch (err) {
        console.error("Failed to fetch sensor data:", err);
      }
    };

    fetchSensorData();
  }, []);

  if (!sensorData) {
    return <div>Loading...</div>;
  }

  const { pH, TDS, Temperature, status, date, location, latitude, longitude } = sensorData;

  // If 'location' is an object, let's extract the latitude and longitude
  const extractedLatitude = location?.latitude || latitude;
  const extractedLongitude = location?.longitude || longitude;

  // Metrics to display: Removing EC as it's no longer needed
  const metrics = [
    { label: "pH", value: pH },
    { label: "TDS", value: TDS },
    { label: "Temperature", value: Temperature },
  ];

  const isOnline = status === "Online";

  // Create a summary of all sensor data and locations
  const summary = `Location of the sensors is at:`;

  return (
    <div className="w-full flex justify-center px-4 lg:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full max-w-7xl">
        {/* Existing Cards for Metrics */}
        {metrics.map(({ label, value }) => (
          <Card key={label} className="shadow-md flex flex-col w-full">
            <CardHeader className="relative flex-grow">
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {typeof value === "number" ? value.toFixed(2) : value}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge
                  variant="outline"
                  className={`flex gap-1 items-center rounded-lg text-xs ${isOnline ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}
                >
                  {isOnline ? (
                    <>
                      <CheckCircle2 className="size-3" />
                      Online
                    </>
                  ) : (
                    <>
                      <XCircle className="size-3" />
                      Offline
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex flex-col items-start text-sm">
              <div className="text-muted-foreground">Last updated:</div>
              <div className="text-xs">{new Date(date).toLocaleString()}</div>
            </CardFooter>
          </Card>
        ))}

        {/* New Card for Summary */}
        <Card className="shadow-md flex flex-col w-full col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3">
          <CardHeader className="relative flex-grow">
            <CardDescription>Summary of Sensor Data</CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {summary}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex flex-col items-start text-sm">
            <div className="text-sm font-semibold">Latitude:</div>
              <div className="text-sm text-gray-600">{extractedLatitude || "Not available"}</div>
              <div className="text-sm font-semibold">Longitude:</div>
              <div className="text-sm text-gray-600">{extractedLongitude || "Not available"}</div>
            
            <div className="mt-4">
              {/* Displaying Latitude and Longitude */}
              <div className="text-muted-foreground">Last updated:</div>
            <div className="text-xs">{new Date(date).toLocaleString()}</div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
