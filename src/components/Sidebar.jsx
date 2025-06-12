import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 fixed">
      <h2 className="text-xl font-bold mb-8">Excel Platform</h2>
      <nav className="flex flex-col gap-4">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/admin">Admin Panel</NavLink>
        <NavLink to="/upload">Excel Upload</NavLink>
        <NavLink to="/history">File History</NavLink>
        <NavLink to="/settings">Settings</NavLink>
        <NavLink to="/profile">User Profile</NavLink>
        <button onClick={logout} className="mt-auto text-red-400">Logout</button>
      </nav>
    </div>
  );
};

export default Sidebar;
