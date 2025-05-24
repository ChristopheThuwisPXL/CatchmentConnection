import React, { useState, useEffect } from "react";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function SectionCards({ data, previousData }: { data: any[], previousData: any[] }) {
  const [averages, setAverages] = useState<any>(null);
  const [previousAverages, setPreviousAverages] = useState<any>(null);

  useEffect(() => {
    console.log("Data received:", data);
  
    const calculateAverage = (array: any[], key: string) => {
      const total = array.reduce((acc: number, item: any) => acc + item[key], 0);
      return total / array.length;
    };
  
    if (Array.isArray(data) && data.length > 0) {
      const currentAverages = {
        pH: calculateAverage(data, "pH"),
        TDS: calculateAverage(data, "TDS"),
        Temperature: calculateAverage(data, "Temperature"),
        EC: calculateAverage(data, "EC"),
      };
  
      setAverages(currentAverages);
      console.log("Current averages:", currentAverages);
  
      if (Array.isArray(previousData) && previousData.length > 0) {
        const previousAvg = {
          pH: calculateAverage(previousData, "pH"),
          TDS: calculateAverage(previousData, "TDS"),
          Temperature: calculateAverage(previousData, "Temperature"),
          EC: calculateAverage(previousData, "EC"),
        };
        setPreviousAverages(previousAvg);
        console.log("Previous averages:", previousAvg);
      } else {
        setPreviousAverages(null);
      }
    } else {
      setAverages(null);
      setPreviousAverages(null);
    }
  }, [data, previousData]);

  if (!averages || !previousAverages) {
    console.log("Averages or previous averages are not available.");
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {Object.keys(averages).map((key) => {
        const current = averages[key];
        const previous = previousAverages[key];
        const change = ((current - previous) / previous) * 100;
        const isTrendingUp = change > 0;
  
        return (
          <Card key={key} className="shadow-xs">
            <CardHeader className="relative">
              <CardDescription>Average {key}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {current.toFixed(2)}
                {key === "TDS" && <span className="text-base align-top"> ppm</span>}
                {key === "Temperature" && <span className="text-base align-top">°C</span>}
                {key === "EC" && <span className="text-base align-top"> µS/cm</span>}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge
                  variant="outline"
                  className={`flex gap-1 rounded-lg text-xs ${
                    isTrendingUp ? "border-red-500 text-red-500" : "border-green-500 text-green-500"
                  }`}
                >
                  {isTrendingUp ? (
                    <>
                      <TrendingUpIcon className="size-3" />
                      +{change.toFixed(2)}%
                    </>
                  ) : (
                    <>
                      <TrendingDownIcon className="size-3" />
                      {change.toFixed(2)}%
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {isTrendingUp ? "Trending up" : "Trending down"}
                {isTrendingUp ? (
                  <TrendingUpIcon className="size-4" />
                ) : (
                  <TrendingDownIcon className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">
                Compared to the previous year
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  )}  
