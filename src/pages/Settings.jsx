import React from 'react';
import Sidebar from '../components/Sidebar';

const Settings = () => (
  <div className="flex">
    <Sidebar />
    <div className="ml-64 p-8 w-full">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <p>This section allows future configuration like themes, notifications, etc.</p>
    </div>
  </div>
);

export default Settings;
