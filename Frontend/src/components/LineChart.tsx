'use client';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const dummyChartData = [
    { date: "2024-01-01", hyacinth_coverage: 20, temperature: 21.0 },
    { date: "2024-01-10", hyacinth_coverage: 25, temperature: 21.5 },
    { date: "2024-01-20", hyacinth_coverage: 30, temperature: 22.0 },
    { date: "2024-02-01", hyacinth_coverage: 35, temperature: 22.2 },
    { date: "2024-02-10", hyacinth_coverage: 40, temperature: 22.8 },
    { date: "2024-02-20", hyacinth_coverage: 38, temperature: 23.0 },
    { date: "2024-03-01", hyacinth_coverage: 30, temperature: 22.5 },
    { date: "2024-03-05", hyacinth_coverage: 45, temperature: 23.0 },
    { date: "2024-03-10", hyacinth_coverage: 60, temperature: 24.0 },
    { date: "2024-03-15", hyacinth_coverage: 50, temperature: 23.5 },
    { date: "2024-03-20", hyacinth_coverage: 65, temperature: 24.5 },
    { date: "2024-03-25", hyacinth_coverage: 70, temperature: 25.0 },
    { date: "2024-03-30", hyacinth_coverage: 80, temperature: 26.0 },
    { date: "2024-04-05", hyacinth_coverage: 85, temperature: 26.5 },
    { date: "2024-04-15", hyacinth_coverage: 90, temperature: 27.0 },
    { date: "2024-04-25", hyacinth_coverage: 95, temperature: 27.5 },
    { date: "2024-05-01", hyacinth_coverage: 100, temperature: 28.0 },
    { date: "2024-05-10", hyacinth_coverage: 98, temperature: 27.8 },
    { date: "2024-05-20", hyacinth_coverage: 95, temperature: 27.5 },
    { date: "2024-06-01", hyacinth_coverage: 85, temperature: 26.5 },
    { date: "2024-06-10", hyacinth_coverage: 80, temperature: 26.0 },
    { date: "2024-06-20", hyacinth_coverage: 75, temperature: 25.5 },
    { date: "2024-07-01", hyacinth_coverage: 70, temperature: 25.0 },
    { date: "2024-07-10", hyacinth_coverage: 65, temperature: 24.5 },
    { date: "2024-07-20", hyacinth_coverage: 60, temperature: 24.0 },
    { date: "2024-08-01", hyacinth_coverage: 55, temperature: 23.8 },
    { date: "2024-08-10", hyacinth_coverage: 50, temperature: 23.5 },
    { date: "2024-08-20", hyacinth_coverage: 45, temperature: 23.0 },
    { date: "2024-09-01", hyacinth_coverage: 40, temperature: 22.8 },
    { date: "2024-09-10", hyacinth_coverage: 35, temperature: 22.5 },
    { date: "2024-09-20", hyacinth_coverage: 30, temperature: 22.2 },
    { date: "2024-10-01", hyacinth_coverage: 25, temperature: 22.0 },
    { date: "2024-10-10", hyacinth_coverage: 20, temperature: 21.8 },
    { date: "2024-10-20", hyacinth_coverage: 15, temperature: 21.5 },
    { date: "2024-11-01", hyacinth_coverage: 10, temperature: 21.0 },
    { date: "2024-11-10", hyacinth_coverage: 8, temperature: 20.8 },
    { date: "2024-11-20", hyacinth_coverage: 5, temperature: 20.5 },
    { date: "2024-12-01", hyacinth_coverage: 3, temperature: 20.2 },
    { date: "2024-12-10", hyacinth_coverage: 2, temperature: 20.0 },
    { date: "2024-12-20", hyacinth_coverage: 1, temperature: 19.8 },
    { date: "2024-12-31", hyacinth_coverage: 0, temperature: 19.5 },
];

const AreaChartComponent = () => {
    return (
        <div style={{ width: '1000px', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dummyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area dataKey="hyacinth_coverage" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AreaChartComponent;
