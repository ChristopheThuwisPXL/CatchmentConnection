import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "recharts";
import AreaChartComponent from "./../components/LineChart";


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
  return (
    <div id="Main">
        <aside id="Side" className="sidebar">
            <img src="@/assets/Images/Logo.png" alt="" />
            <h2>Menu</h2>
            <ul>
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Live Data</a></li>
                <li><a href="#">Historical Data</a></li>
                <li><a href="#">Settings</a></li>
            </ul>
            <div id="Filter" className="filter">
              <label htmlFor="startDate">Start Date:</label>
              <input type="date" id="startDate" name="startDate" className="filterItems"/>
              <label htmlFor="endDate">End Date:</label>
              <input type="date" id="endDate" name="endDate" className="filterItems" />
              <a href="#">Filter</a>
            </div>
        </aside>
        <main id="Body" className="main-content">
          <div id="Header" className="header">
            <h1>Historical Data</h1>
          </div>
          <div className="flex min-h-screen flex-col items-center justify-center px-4 md:px-8 xl:px-10">
            <GridItem title = "Line Chart">
              <AreaChartComponent/>
            </GridItem>
          </div>
        </main>
    </div>
  );
};

export default HistoricData;
