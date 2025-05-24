import { useMemo } from "react";
import { useDashboardData } from "@/hooks/usePredictions";
import { ReferenceLine } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Tooltip as UITooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const chartConfig: ChartConfig = {
  desktop: {
    label: "Predicted",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Actual",
    color: "hsl(var(--chart-2))",
  },
};

const metricColors: Record<string, string> = {
  pH: "#1e3a8a",
  TDS: "#1e3a8a",
  Temperature: "#1e3a8a",
};

export function DashboardChart() {
  const { history, forecast, error } = useDashboardData();

  const phData = useMemo(() => combineActualAndPredictedData("pH", history, forecast), [history, forecast]);
  const tdsData = useMemo(() => combineActualAndPredictedData("TDS", history, forecast), [history, forecast]);


  if (error) {
    return <div className="text-red-500 font-medium">Error loading dashboard data: {error}</div>;
  }

  return (
  <div className="grid grid-cols-1 md:grid-cols-3 px-8">
    <div className="m-1">
      <ForecastCard
        title="pH Forecast"
        colorKey="pH"
        data={phData}
        tooltip={{
          label: "Prophet forecast model",
          content: [
            "Forecasts future pH values using Prophet. (1 model per parameter)",
            "Forecasts for 30 days, 20-min intervals.",
            "Used in anomaly/severity classification.",
            "Trained on real-time sensor data.",   
          ]
        }}
      />
    </div>
    <div className="m-1">
      <ForecastCard
        title="TDS Forecast"
        colorKey="TDS"
        data={tdsData}
        tooltip={{
          label: "Prophet forecast model",
          content: [
            "Forecasts future TDS values using Prophet. (1 model per parameter)",
            "Forecasts for 30 days, 20-min intervals.",
            "Used in anomaly/severity classification.",
            "Trained on real-time sensor data.",   
          ]
        }}
      />
    </div>
    <div className="m-1">
      <ForecastCard
        title="Temperature Forecast"
        colorKey="Temperature"
        data={phData}
        tooltip={{
          label: "Prophet forecast model",
          content: [
            "Forecasts future Temperature values using Prophet. (1 model per parameter)",
            "Forecasts for 30 days, 20-min intervals.",
            "Used in anomaly/severity classification.",
            "Trained on real-time sensor data.",   
          ]
        }}
      />
    </div>
  </div>
  );
}

function combineActualAndPredictedData(
  key: "pH" | "TDS" | "Temperature",
  actual: any[],
  predicted: any[]
) {
  const format = (row: any) => ({
    time: row.ds.split("T")[0],
    value: row[key],
  });

  const actualMap = new Map<string, number>();
  const predictedMap = new Map<string, number>();

  actual.forEach((r) => {
    const { time, value } = format(r);
    if (value != null) actualMap.set(time, value);
  });

  predicted.forEach((r) => {
    const { time, value } = format(r);
    if (value != null) predictedMap.set(time, value);
  });

  const allDays = Array.from(new Set([...actualMap.keys(), ...predictedMap.keys()])).sort();

  return allDays.map((day) => ({
    time: day,
    actual: actualMap.get(day) ?? null,
    predicted: predictedMap.get(day) ?? null,
  }));
}

function ForecastCard({
  title,
  data,
  colorKey,
  tooltip,
}: {
  title: string
  data: any[]
  colorKey: keyof typeof metricColors
  tooltip: {
    label: string
    content: string[]
  }
}) {
  const predictionStart = data.find((d) => d.predicted != null)?.time;
  const actualColor = metricColors[colorKey];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{title}</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-lg rounded-md px-4 py-3 text-sm max-w-xs">
                <div className="font-medium mb-1 text-foreground">{tooltip.label}</div>
                <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
                  {tooltip.content.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={data} margin={{ left: -40, right: 1 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickFormatter={(t) =>
                new Date(t).toLocaleDateString("default", {
                  day: "numeric",
                  month: "short",
                })
              }
              tick={{ fontSize: 10 }}
              tickMargin={6}
            />
            <YAxis domain={["auto", "auto"]} allowDataOverflow />
            <Tooltip content={<ChartTooltipContent />} />
            {predictionStart && (
              <ReferenceLine
                x={predictionStart}
                stroke="#ef4444"
                strokeWidth={2}
                isFront={true}
              />
            )}
            <Line
              type="monotone"
              dataKey="actual"
              stroke={actualColor}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#ff7300"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}




