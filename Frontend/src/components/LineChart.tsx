import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from "recharts";

interface ChartProps {
  data: { date: string; hyacinth_coverage: number; temperature: number }[];
}

const AreaChartComponent: React.FC<ChartProps> = ({ data }) => {
  console.log("Chart Data Received:", data);

  const formattedData = data.map(entry => ({
    ...entry,
    date: new Date(entry.date).toLocaleDateString("en-CA"),
  }));

  console.log("Formatted Data for Chart:", formattedData);

  return (
    <ResponsiveContainer width={1000} height={400}>
      <AreaChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <XAxis 
          dataKey="date" 
          tickFormatter={(tick) => new Date(tick).toLocaleDateString("en-CA")} // Format X-axis labels
        />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="hyacinth_coverage" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
