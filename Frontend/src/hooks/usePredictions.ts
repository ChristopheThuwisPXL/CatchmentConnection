import { useState, useEffect } from "react";

export interface CombinedDataPoint {
  ds: string;
  pH: number | null;
  TDS: number | null;
  Temperature: number | null;
  EC: number | null;
}

export interface AnomalyCount {
  month: string;
  anomaly_count: number;
}

export interface SeverityCounts {
  month: string;
  [level: string]: number | string;
}

const TTL_MS = 20 * 60 * 1000;

export function useDashboardData() {
  const [history, setHistory] = useState<CombinedDataPoint[]>([]);
  const [forecast, setForecast] = useState<CombinedDataPoint[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyCount[]>([]);
  const [predictedAnomalies, setPredictedAnomalies] = useState<AnomalyCount[]>([]);
  const [severities, setSeverities] = useState<SeverityCounts[]>([]);
  const [predictedSeverities, setPredictedSeverities] = useState<SeverityCounts[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const now = Date.now();
    const cached = localStorage.getItem("dashboard_cache");

    if (cached) {
      const parsed = JSON.parse(cached);
      if (now - parsed.timestamp < TTL_MS) {
        setHistory(parsed.history);
        setForecast(parsed.forecast);
        setAnomalies(parsed.anomalies);
        setPredictedAnomalies(parsed.predictedAnomalies);
        setSeverities(parsed.severities);
        setPredictedSeverities(parsed.predictedSeverities);
        return;
      }
    }

    const fetchData = async () => {
      try {
        const [
          histRes,
          forecastRes,
          anomalyRes,
          predictedAnomalyRes,
          severityRes,
          predictedSeverityRes
        ] = await Promise.all([
          fetch("http://localhost:5000/history/combined"),
          fetch("http://localhost:5000/predict"),
          fetch("http://localhost:5000/predict/anomalies"),
          fetch("http://localhost:5000/predict/anomalies/future"),
          fetch("http://localhost:5000/predict/severities"),
          fetch("http://localhost:5000/predict/severities/future")
        ]);

        if (
          !histRes.ok || !forecastRes.ok ||
          !anomalyRes.ok || !predictedAnomalyRes.ok ||
          !severityRes.ok || !predictedSeverityRes.ok
        ) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [
          hist,
          pred,
          realAnomalies,
          futureAnomalies,
          realSeverities,
          futureSeverities
        ] = await Promise.all([
          histRes.json(),
          forecastRes.json(),
          anomalyRes.json(),
          predictedAnomalyRes.json(),
          severityRes.json(),
          predictedSeverityRes.json()
        ]);

        const cachePayload = {
          timestamp: now,
          history: hist,
          forecast: pred,
          anomalies: realAnomalies,
          predictedAnomalies: futureAnomalies,
          severities: realSeverities,
          predictedSeverities: futureSeverities
        };

        localStorage.setItem("dashboard_cache", JSON.stringify(cachePayload));

        setHistory(hist);
        setForecast(pred);
        setAnomalies(realAnomalies);
        setPredictedAnomalies(futureAnomalies);
        setSeverities(realSeverities);
        setPredictedSeverities(futureSeverities);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return {
    history,
    forecast,
    anomalies,
    predictedAnomalies,
    severities,
    predictedSeverities,
    error
  };
}
