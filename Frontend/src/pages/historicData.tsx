'use client';
import React, { useState } from "react";
import AreaChartComponent from "./../components/LineChart";
import dummyChartData from "./../components/HistoricalData"; 
import "./history.css";

interface GridItemProps {
  title: string;
  children?: React.ReactNode;
}

const GridItem: React.FC<GridItemProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-900 bg-slate-900/50 rounded-xl h-[400px]">
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
};

const HistoricData: React.FC = () => {
  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState(""); 

  
  if (!dummyChartData || !Array.isArray(dummyChartData)) {
    console.error("dummyChartData is not loaded correctly!");
    return <p>Error: Data not found</p>;
  }


  const filteredData = dummyChartData.filter((data) => {
    if (!data.date) return false;
  
    const dataDate = data.date; 
    const start = startDate ? startDate : null; 
    const end = endDate ? endDate : null; 
  
    return (!start || dataDate >= start) && (!end || dataDate <= end);
  });
  

  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);
  console.log("Raw Data:", dummyChartData);
  console.log("Filtered Data After Processing:", filteredData);

  return (
    <div id="Main">
      <aside id="Side" className="sidebar">
        <img src="@/assets/Images/Logo.png" alt="Logo" />
        <h2>Menu</h2>
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Live Data</a></li>
          <li><a href="#">Historical Data</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
        <div id="Filter" className="filter">
          <label htmlFor="startDate">Start Date:</label>
          <input 
            type="date" 
            id="startDate" 
            name="startDate" 
            className="filterItems" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label htmlFor="endDate">End Date:</label>
          <input 
            type="date" 
            id="endDate" 
            name="endDate" 
            className="filterItems" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </aside>

      <main id="Body" className="main-content">
        <div id="Header" className="header">
          <h1>Historical Data</h1>
        </div>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 md:px-8 xl:px-10">
          <GridItem title="Line Chart">
            {filteredData.length > 0 ? (
              <AreaChartComponent data={filteredData} />
            ) : (
              <p className="text-white">No data available for selected dates.</p>
            )}
          </GridItem>
        </div>
      </main>
    </div>
  );
};

export default HistoricData;



