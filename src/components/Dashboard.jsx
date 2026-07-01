import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/api/events');
    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(prevData => [...prevData, newData]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Real-Time System Metrics</h1>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cpuUsage" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="memoryUsage" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
