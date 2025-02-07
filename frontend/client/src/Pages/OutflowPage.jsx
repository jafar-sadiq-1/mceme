import React, { useState } from 'react';
import Header from '../components/Header'; 

// Function to format the date as "31 May 2024"
const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const OutflowPage = () => {
  const [remarks, setRemarks] = useState([]);

  const data = [
    { srNo: 1, date: '2024-05-01', outflow: 'Unit 1', subsPrevYr: 500, subsCurYr: 700.09 },
    { srNo: 2, date: '2024-05-02', outflow: 'Unit 2', subsPrevYr: 600, subsCurYr: 800 },
    { srNo: 3, date: '2024-05-03', outflow: 'Unit 3', subsPrevYr: 700, subsCurYr: 900 },
    { srNo: 4, date: '2024-05-04', outflow: 'Unit 4', subsPrevYr: 800, subsCurYr: 1000 },
  ];

  const currentDate = new Date();
  const currentMonthYear = formatDate(currentDate);

  const handleRemarkChange = (index, value) => {
    const newRemarks = [...remarks];
    newRemarks[index] = value;
    setRemarks(newRemarks);
  };

  // Calculate row totals
  const rowTotals = data.map((item) => item.subsPrevYr + item.subsCurYr);

  // Function to format the amount to two decimals
  const formatAmount = (amt) => amt.toFixed(2);

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100" style={{ fontFamily: 'Times New Roman, serif' }}>
    <div className="py-10 flex justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-auto">
        <h1 className="text-center text-2xl font-bold mb-6">
          Outflow Statement for the month of {currentMonthYear}
        </h1>
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
              {data.map((item, index) => {
                const rowTotal = rowTotals[index];  // Fetch row total for the current row
                return (
                  <tr key={index} className="text-center">
                    <td className="border border-black p-3">{item.srNo}</td>
                    <td className="border border-black p-3">{item.date}</td>
                    <td className="border border-black p-3">{item.outflow}</td>
                    <td className="border border-black p-3">{formatAmount(rowTotal)}</td>
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
                );
              })}
              {/* Total Row */}
              <tr className="text-center font-bold bg-gray-200">
                <td className="border border-black p-3" colSpan={3}>
                  Total
                </td>
                <td className="border border-black p-3">{formatAmount(rowTotals.reduce((acc, total) => acc + total, 0))}</td>
                <td className="border border-black p-3">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div> 
    </div>
  </>
  );
};

export default OutflowPage;
