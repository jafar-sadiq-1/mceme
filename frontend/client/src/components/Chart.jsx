import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getCurrentFinancialYear, getFinancialYearsList } from '../utils/financialYearHelper';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear());
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const financialYears = getFinancialYearsList(10);
  const months = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];

  useEffect(() => {
    const fetchReceiptTotals = async () => {
      setLoading(true);
      setError(null);
      try {
        const monthlyData = {};
        
        // Fetch data for each month
        for (const month of months) {
          const response = await axios.get('http://localhost:5000/api/receipts', {
            params: {
              year: selectedFY,
              month: month
            }
          });

          // Calculate total bank amount for the month
          const totalBank = response.data.reduce((sum, receipt) => sum + (Number(receipt.bank) || 0), 0);
          monthlyData[month] = totalBank;
        }

        setMonthlyTotals(monthlyData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptTotals();
  }, [selectedFY]);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Bank Receipts Total',
        data: months.map(month => monthlyTotals[month] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Monthly Bank Receipts Analysis</h1>
        
        <div className="mb-4">
          <select
            className="border rounded px-3 py-2"
            value={selectedFY}
            onChange={(e) => setSelectedFY(e.target.value)}
          >
            {financialYears.map((fy) => (
              <option key={fy} value={fy}>{fy}</option>
            ))}
          </select>
        </div>

        {/* Table Section */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-violet-500 text-white">
              <tr>
                <th className="border border-gray-300 p-2">Month</th>
                <th className="border border-gray-300 p-2">Bank Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {months.map((month, index) => (
                <tr key={month} className={index % 2 === 0 ? "bg-violet-50" : "bg-white"}>
                  <td className="border border-gray-300 p-2 text-center">{month}</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {(monthlyTotals[month] || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                </tr>
              ))}
              <tr className="bg-violet-200 font-bold">
                <td className="border border-gray-300 p-2 text-center">Total</td>
                <td className="border border-gray-300 p-2 text-right">
                  {Object.values(monthlyTotals)
                    .reduce((sum, value) => sum + value, 0)
                    .toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Graph Section */}
        <div className="h-[400px]">
          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: `Monthly Bank Receipts for ${selectedFY}`
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount (₹)'
                    }
                  }
                }
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chart;
