import React from 'react';
import Sidebar from '../components/Sidebar';

const AdminPanel = () => (
  <div className="flex">
    <Sidebar />
    <div className="ml-64 p-8 w-full">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <p>Admin Name: Mohit</p>
      <p>Role: Super Admin</p>
      <p>Email: mohit@example.com</p>
    </div>
  </div>
);

export default AdminPanel;
