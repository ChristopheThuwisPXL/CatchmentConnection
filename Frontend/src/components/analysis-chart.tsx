import { Info } from "lucide-react"
import { useDashboardData } from "@/hooks/usePredictions"
import { MapPreviewCard } from "@/components/map-preview-card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const SEVERITY_LEVELS = ["Critical", "High", "Moderate", "Low"] as const
type SeverityLevel = (typeof SEVERITY_LEVELS)[number]

type SeverityRow = {
  month: string
  [key: string]: number | string
}

const severityColors: Record<SeverityLevel, string> = {
  Critical: "#1e3a8a",
  High: "#3b82f6",
  Moderate: "#93c5fd",
  Low: "#e0f2fe",
}

export function AnalysisCharts() {
  const {
    severities,
    predictedSeverities,
    anomalies,
    predictedAnomalies,
  } = useDashboardData()

  const allMonths = Array.from(
    new Set([...severities, ...predictedSeverities, ...anomalies, ...predictedAnomalies].map((d) => d.month))
  ).sort()

  const severityData = allMonths.map((monthStr) => {
    const actual = severities.find((d) => d.month === monthStr) as SeverityRow || {}
    const predicted = predictedSeverities.find((d) => d.month === monthStr) as SeverityRow || {}
    const monthName = new Date(monthStr + "-01").toLocaleString("default", { month: "long" })

    const entry: Record<string, any> = { month: monthName }

    SEVERITY_LEVELS.forEach((level) => {
      const actualVal = (actual[level] as number) ?? 0
      const predVal = (predicted[level] as number) ?? 0
      entry[level] = actualVal + predVal
    })

    return entry
  })

    const combinedAnomalyData = allMonths.map((monthStr) => {
    const actual = anomalies.find((d) => d.month === monthStr)?.anomaly_count ?? 0
    const predicted = predictedAnomalies.find((d) => d.month === monthStr)?.anomaly_count ?? 0
    const total = actual + predicted
    const monthName = new Date(monthStr + "-01").toLocaleString("default", { month: "long" })

    return {
        month: monthName,
        anomalies: total,
    }
    })

  const severityConfig: ChartConfig = Object.fromEntries(
    SEVERITY_LEVELS.map((level) => [
      level,
      { label: level, color: severityColors[level] }
    ])
  )

    const anomalyConfig: ChartConfig = {
    anomalies: {
        label: "Anomalies",
        color: "#1e3a8a",
    },
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-8">
      <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
            <CardTitle>Severity Classification</CardTitle>
            <TooltipProvider>
                <UITooltip>
                <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-lg rounded-md px-4 py-3 text-sm max-w-xs"
                                side="top"
                                sideOffset={8}>
                    <div className="font-medium mb-1 text-foreground">Random Forest Classifier</div>
                    <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
                    <li>Uses pH, TDS, and Temperature to classify water quality.</li>
                    <li>Categories: Critical, High, Moderate, Low.</li>
                    <li>Model trained on real-time sensor data.</li>
                    <li>Most Frequent Class: {
                    (() => {
                        const counts = SEVERITY_LEVELS.reduce((acc, level) => {
                        acc[level] = severities.reduce((sum, row) => sum + (row[level] as number || 0), 0);
                        return acc;
                        }, {} as Record<string, number>)
                        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
                    })()
                    }</li>
                    </ul>
                </TooltipContent>
                </UITooltip>
            </TooltipProvider>
            </div>
            <CardDescription>Based on Random Forest Classifier</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={severityConfig}>
            <BarChart data={severityData} margin={{ right: 5, left: -25 }} barCategoryGap={12}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              {SEVERITY_LEVELS.map((level) => (
                <Bar
                  key={level}
                  dataKey={level}
                  fill={severityColors[level]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
            <CardTitle>Anomaly Detection</CardTitle>
            <TooltipProvider>
                <UITooltip>
                <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-lg rounded-md px-4 py-3 text-sm max-w-xs"
                                side="top"
                                sideOffset={8}>
                    <div className="font-medium mb-1 text-foreground">Isolation Forest</div>
                    <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
                        <li>Contamination: 1%</li>
                        <li>Features: pH, TDS, Temperature</li>
                        <li>Total Anomalies Detected: {
                        anomalies.reduce((sum, row) => sum + (row.anomaly_count ?? 0), 0) +
                        predictedAnomalies.reduce((sum, row) => sum + (row.anomaly_count ?? 0), 0)
                        }</li>
                    </ul>
                </TooltipContent>
                </UITooltip>
            </TooltipProvider>
            </div>
            <CardDescription>Based on Isolation Forest</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={anomalyConfig}>
            <LineChart data={combinedAnomalyData} margin={{ right: 5, left: -25 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                type="monotone"
                dataKey="anomalies"
                stroke="#1e3a8a"
                strokeWidth={2}
                dot={true}
                isAnimationActive={false}
                />
            </LineChart>
            </ChartContainer>
        </CardContent>
      </Card>
        <MapPreviewCard />
    </div>
  )
}
