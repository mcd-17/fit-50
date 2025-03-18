import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

             
  
  
  

const ChartComponent = ({data}) => {
  return (
    <div className='h-[350px] w-full'>
      <ResponsiveContainer style={{ width: '100%', height: '400px' }}>
        <LineChart
          data={data} // Removed layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" /> {/* XAxis for categories */}
          <YAxis datakey="money"/> {/* YAxis for numerical values */}
          <Tooltip />
          {/* <Legend /> */}
          <Line type="monotone" dataKey="money" stroke="#E67529" strokeWidth={2} />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" strokeWidth={2} /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
