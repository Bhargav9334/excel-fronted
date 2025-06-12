// src/pages/FileHistory.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const FileHistory = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('fileHistory')) || [];
    setHistory(storedHistory);
  }, []);

  const getFilteredHistory = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    return history
      .filter((item) => {
        const itemDate = new Date(item.date);
        const isToday = itemDate.toDateString() === today.toDateString();
        const isYesterday = itemDate.toDateString() === yesterday.toDateString();

        if (filter === 'today') return isToday;
        if (filter === 'yesterday') return isYesterday;
        return true;
      })
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  const handleDelete = (index) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1);
    localStorage.setItem('fileHistory', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  const handleClearAll = () => {
    localStorage.removeItem('fileHistory');
    setHistory([]);
  };

  const handleReload = (item) => {
    if (!item.base64 || !item.name) {
      alert("This file doesn't have reloadable data.");
      return;
    }

    navigate('/upload', {
      state: {
        base64: item.base64,
        name: item.name,
      },
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">File Upload History</h1>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear All History
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          {['all', 'today', 'yesterday'].map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by file name..."
            className="border border-gray-300 rounded px-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* History List */}
        {getFilteredHistory().length > 0 ? (
          <ul className="space-y-3">
            {getFilteredHistory().map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-3 rounded shadow"
              >
                <div>
                  <div className="font-semibold">📁 {item.name}</div>
                  <div className="text-sm text-gray-600">
                    📅 {new Date(item.date).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReload(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Reload
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No files match your filter or search.</p>
        )}
      </div>
    </div>
  );
};

export default FileHistory;
