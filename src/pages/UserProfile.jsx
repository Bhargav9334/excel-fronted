import React from 'react';
import Sidebar from '../components/Sidebar';

const UserProfile = () => (
  <div className="flex">
    <Sidebar />
    <div className="ml-64 p-8 w-full">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <p>User ID: mohit</p>
      <p>Email: mohit@example.com</p>
      <p>Role: Analyst</p>
    </div>
  </div>
);

export default UserProfile;
