import React from 'react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => (
  <div className="flex">
    <Sidebar />
    <div className="ml-64 p-8 w-full">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome to the Excel Analytics Dashboard.</p>
    </div>
  </div>
);

export default Dashboard;
