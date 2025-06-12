import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Bar, Pie, Line, Doughnut, Scatter } from 'react-chartjs-2';
import Sidebar from '../components/Sidebar';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate, useLocation } from 'react-router-dom';

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ExcelUpload = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xCol, setXCol] = useState('');
  const [yCol, setYCol] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [history, setHistory] = useState([]);
  const chartRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fileHistory = JSON.parse(localStorage.getItem('fileHistory')) || [];
    setHistory(fileHistory);
  }, []);

  // ✅ Handle Reload via location.state
  useEffect(() => {
    if (location.state?.base64 && location.state?.name) {
      handleBase64File(location.state.base64, location.state.name);
      setUploadedFile({ name: location.state.name, base64: location.state.base64 });

      // Optional: Clear state to prevent re-execution on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const saveHistory = (name, base64) => {
    const newEntry = { name, date: new Date().toISOString(), base64 };
    const updatedHistory = [...history, newEntry];
    localStorage.setItem('fileHistory', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target.result.split(',')[1];
      setUploadedFile({ name: file.name, base64 });
      saveHistory(file.name, base64);
      handleBase64File(base64, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleBase64File = (base64, name) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const wb = XLSX.read(bytes, { type: 'array' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

    const headers = jsonData[0];
    const rows = jsonData.slice(1).filter(row => row.length >= 2);

    setColumns(headers);
    setData(rows);
    setXCol(headers[0]);
    setYCol(headers[1]);
  };

  const getChartData = () => {
    const xIndex = columns.indexOf(xCol);
    const yIndex = columns.indexOf(yCol);

    const validData = data
      .filter(row => row[xIndex] !== undefined && !isNaN(row[yIndex]))
      .map(row => [row[xIndex], Number(row[yIndex])]);

    const labels = validData.map(row => row[0]);
    const values = validData.map(row => row[1]);

    return {
      labels,
      datasets: [
        {
          label: `${yCol} vs ${xCol}`,
          data: values,
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getScatterData = () => {
    const xIndex = columns.indexOf(xCol);
    const yIndex = columns.indexOf(yCol);

    const scatterPoints = data
      .filter(row => !isNaN(row[xIndex]) && !isNaN(row[yIndex]))
      .map(row => ({ x: Number(row[xIndex]), y: Number(row[yIndex]) }));

    return {
      datasets: [
        {
          label: `${yCol} vs ${xCol}`,
          data: scatterPoints,
          backgroundColor: 'rgba(153,102,255,0.6)',
        },
      ],
    };
  };

  const renderChart = () => {
    const chartData = getChartData();
    const scatterData = getScatterData();

    switch (chartType) {
      case 'bar':
        return <Bar ref={chartRef} data={chartData} />;
      case 'pie':
        return <Pie ref={chartRef} data={chartData} />;
      case 'line':
        return <Line ref={chartRef} data={chartData} />;
      case 'doughnut':
        return <Doughnut ref={chartRef} data={chartData} />;
      case 'scatter':
        return <Scatter ref={chartRef} data={scatterData} />;
      default:
        return null;
    }
  };

  const downloadAsPDF = async () => {
    const canvas = await html2canvas(document.getElementById('chart-container'));
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
    pdf.save('chart.pdf');
  };

  const downloadAsExcel = () => {
    if (!uploadedFile?.base64) return;
    const link = document.createElement('a');
    link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${uploadedFile.base64}`;
    link.download = uploadedFile.name;
    link.click();
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-4">📊 Excel Upload</h1>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mb-4"
        />

        {data.length > 0 && (
          <>
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label className="font-medium mr-2">X-Axis:</label>
                <select
                  className="border p-2 rounded"
                  value={xCol}
                  onChange={(e) => setXCol(e.target.value)}
                >
                  {columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium mr-2">Y-Axis:</label>
                <select
                  className="border p-2 rounded"
                  value={yCol}
                  onChange={(e) => setYCol(e.target.value)}
                >
                  {columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium mr-2">Chart Type:</label>
                <select
                  className="border p-2 rounded"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <option value="bar">Bar</option>
                  <option value="pie">Pie</option>
                  <option value="line">Line</option>
                  <option value="doughnut">Doughnut</option>
                  <option value="scatter">Scatter</option>
                </select>
              </div>
            </div>

            <div id="chart-container" className="bg-white p-4 rounded shadow">
              {renderChart()}
            </div>

            <div className="mt-6 space-x-4">
              <button
                onClick={downloadAsPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download Chart as PDF
              </button>
              <button
                onClick={downloadAsExcel}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download Excel
              </button>
            </div>
          </>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">📁 Previous Upload</h2>
          {history.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded shadow space-y-3">
              <div className="flex justify-between items-center bg-white px-4 py-2 rounded border shadow-sm">
                <div>
                  <span className="font-medium">{history[history.length - 1].name}</span>
                  <span className="block text-sm text-gray-500">
                    Uploaded on: {new Date(history[history.length - 1].date).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() =>
                    navigate('/upload', {
                      state: {
                        base64: history[history.length - 1].base64,
                        name: history[history.length - 1].name,
                      },
                    })
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Reload
                </button>
              </div>
              <button
                onClick={() => navigate('/FileHistory')}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                ➕ See Full History
              </button>
            </div>
          ) : (
            <p className="text-gray-600">No previous uploads found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelUpload;
