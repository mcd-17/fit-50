import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MonthlyEarningsChart = ({ data }) => {
    const currentYear = new Date().getFullYear();

    const formattedData = data?.map(item => ({
        ...item,
        month: new Date(0, item.month - 1).toLocaleString('default', { month: 'long' }) // Converts 1 -> "January", 2 -> "February", etc.
    }));

    return (
        <div style={{ width: '100%', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
                Total Earning Analysis - {currentYear}
            </h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="earnings" fill="#8884d8" name="Earnings (USD)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyEarningsChart;
