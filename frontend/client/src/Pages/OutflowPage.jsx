import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { AppContext } from '../AppContext/ContextProvider';
import { getFinancialYearsList, getCurrentFinancialYear } from '../utils/financialYearHelper';
import * as XLSX from 'xlsx';

const OutflowPage = () => {
  const [remarks, setRemarks] = useState([]);
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [outflowData, setOutflowData] = useState([]);

  const financialYears = getFinancialYearsList(10);
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/payments', {
          params: { 
            year: selectedFY,
            month: selectedMonth // Now sending month name directly
          }
        });

        console.log('Fetched data:', response.data); // Debug log

        // Filter and transform payments
        const transformedData = response.data
          .filter(payment => payment.voucherType === "PV" && payment.method === "bank")
          .map((payment, index) => ({
            srNo: index + 1,
            date: new Date(payment.date).toLocaleDateString("en-GB"),
            outflow: payment.particulars === "Custom" ? 
                    payment.customParticulars : 
                    payment.particulars,
            total: Number(payment[payment.method] || 0)
          }));

        setOutflowData(transformedData);
      } catch (error) {
        setError("Failed to fetch payments");
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [selectedFY, selectedMonth]);

  // Calculate total
  const totalAmount = outflowData.reduce((sum, item) => sum + item.total, 0);

  const handleRemarkChange = (index, value) => {
    setRemarks(prev => {
      const newRemarks = [...prev];
      newRemarks[index] = value;
      return newRemarks;
    });
  };

  const handlePrint = () => {
    const printContents = document.getElementById("print").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = `
      <!DOCTYPE html>
      <html>
        <body>
          ${printContents}
        </body>
      </html>
    `;
    window.print();
    document.body.innerHTML = originalContents; // Restore after printing
    window.location.reload(); // Ensure scripts reattach after print
  };

  const handleExcelExport = () => {
    const excelData = outflowData.map(item => ({
      'Date': item.date,
      'Outflow': item.outflow,
      'Total': item.total,
      'Remarks': remarks[item.srNo - 1] || ''
    }));

    // Add total row
    excelData.push({
      'Date': 'Total',
      'Outflow': '',
      'Total': totalAmount,
      'Remarks': ''
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Outflow');
    XLSX.writeFile(wb, `Outflow_${selectedFY}_${selectedMonth || 'All'}.xlsx`);
  };

  let heading;
  if (!selectedFY && !selectedMonth) {
    heading = "Outflow Statement";
  } else if (selectedFY && !selectedMonth) {
    heading = `Outflow Statement for ${selectedFY}`;
  } else {
    heading = `Outflow Statement for ${selectedMonth} ${selectedFY}`;
  }

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100" 
           style={{ fontFamily: 'Times New Roman, serif' }}>
        <div className="py-10 flex justify-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-auto">
            {/* Add Filters */}
            <div className="mb-6 flex space-x-4">
              <select
                className="border px-4 py-2 rounded-lg"
                value={selectedFY}
                onChange={(e) => setSelectedFY(e.target.value)}
              >
                {financialYears.map((fy) => (
                  <option key={fy} value={fy}>{fy}</option>
                ))}
              </select>

              <select
                className="border px-4 py-2 rounded-lg"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {monthNames.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div id="print">
              <h1 className="text-center text-2xl font-bold mb-6">{heading}</h1>
              
              {loading && <div className="text-center">Loading...</div>}
              {error && <div className="text-center text-red-500">{error}</div>}
              
              {!loading && !error && (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="bg-violet-400 text-black">
                      <tr>
                        <th className="border border-black p-3">S.No</th>
                        <th className="border border-black p-3">Date</th>
                        <th className="border border-black p-3">Outflow</th>
                        <th className="border border-black p-3">Total</th>
                        <th className="border border-black p-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outflowData.map((item, index) => (
                        <tr key={index} className="text-center">
                          <td className="border border-black p-3">{item.srNo}</td>
                          <td className="border border-black p-3">{item.date}</td>
                          <td className="border border-black p-3">{item.outflow}</td>
                          <td className="border border-black p-3">₹{item.total.toFixed(2)}</td>
                          <td className="border border-black p-3">
                            <input
                              type="text"
                              value={remarks[index] || ''}
                              onChange={(e) => handleRemarkChange(index, e.target.value)}
                              placeholder="Enter remarks"
                              className="border border-black px-1 py-1 w-full"
                            />
                          </td>
                        </tr>
                      ))}
                      <tr className="text-center font-bold bg-gray-200">
                        <td className="border border-black p-3" colSpan={3}>Total</td>
                        <td className="border border-black p-3">₹{totalAmount.toFixed(2)}</td>
                        <td className="border border-black p-3">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {!loading && !error && outflowData.length > 0 && (
          <div className="flex justify-center mt-4 gap-4">
            <button onClick={handlePrint} className="bg-green-500 border border-black text-black px-4 py-2 rounded hover:bg-green-600 hover:scale-110 transition-transform duration-200">
              Print
            </button>
            <button onClick={handleExcelExport} className="bg-blue-500 border border-black text-black px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition-transform duration-200">
              Export to Excel
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default OutflowPage;