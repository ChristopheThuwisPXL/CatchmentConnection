import { useState, useEffect } from "react";

export function useHistoricalData(year: number) {
  const [currentData, setCurrentData] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!year) {
      setCurrentData([]);
      setPreviousData([]);
      return;
    }

    const fetchData = async () => {
      try {
        const current = await fetch(`http://localhost:5000/history?year=${year}`).then((res) => res.json());
        const previous = await fetch(`http://localhost:5000/history?year=${year - 1}`).then((res) => res.json());
        setCurrentData(current);
        setPreviousData(previous);
      } catch (err: any) {
        setError(err.message); 
        console.error("Error fetching data:", err);
      }
    };
    if (year === new Date().getFullYear()) {
      fetchData();
    } else {
      fetchData();
    }
  }, [year]);
  return { currentData, previousData, error };
}
