import React, { useState } from 'react';

// Function to format the date as "31 May 2024"
const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }); // Gets the abbreviated month (e.g., "May")
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Function to get previous and current financial years dynamically
const getFinancialYears = (currentYear) => {
  const prevFinancialYear = `${currentYear - 1}-${currentYear}`;
  const currentFinancialYear = `${currentYear}-${currentYear + 1}`;
  return { prevFinancialYear, currentFinancialYear };
};

const InflowPage = () => {
  const [remarks, setRemarks] = useState([]);

  const data = [
    { srNo: 1, date: '2024-05-01', inflow: 'Unit 1', subsPrevYr: 1000, subsCurYr: 1500.04, otherReceipts: 200 },
    { srNo: 2, date: '2024-05-02', inflow: 'Unit 2', subsPrevYr: 1200, subsCurYr: 1800, otherReceipts: 300 },
    { srNo: 3, date: '2024-05-03', inflow: 'Unit 3', subsPrevYr: 1300, subsCurYr: 2000, otherReceipts: 400 },
    { srNo: 4, date: '2024-05-04', inflow: 'Unit 4', subsPrevYr: 1400, subsCurYr: 2200, otherReceipts: 500 },
  ];

  // Get current date and financial years
  const currentDate = new Date();
  const currentMonthYear = formatDate(currentDate);
  const { prevFinancialYear, currentFinancialYear } = getFinancialYears(currentDate.getFullYear());

  const handleRemarkChange = (index, value) => {
    const newRemarks = [...remarks];
    newRemarks[index] = value;
    setRemarks(newRemarks);
  };

  // Calculate row totals and column totals
  const rowTotals = data.map((item) => {
    return item.subsPrevYr + item.subsCurYr + item.otherReceipts; // Sum of each row
  });

  const columnTotals = {
    inflow: data.reduce((acc, item) => acc + item.inflow.length, 0), // Summing the length of unit names for inflow
    subsPrevYr: data.reduce((acc, item) => acc + item.subsPrevYr, 0),
    subsCurYr: data.reduce((acc, item) => acc + item.subsCurYr, 0),
    otherReceipts: data.reduce((acc, item) => acc + item.otherReceipts, 0),
    total: rowTotals.reduce((acc, total) => acc + total, 0),
  };

  // Function to format the amount to two decimals
  const formatAmount = (amt) => amt.toFixed(2);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-6">
        Inflow Statement for the month of {currentMonthYear}
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-700">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-black p-3">S.No</th>
              <th className="border border-black p-3">Date</th>
              <th className="border border-black p-3">Inflow</th>
              <th className="border border-black p-3">
                Subs for {prevFinancialYear}
              </th>
              <th className="border border-black p-3">
                Subs for {currentFinancialYear}
              </th>
              <th className="border border-black p-3">Other Receipts</th>
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
                  <td className="border border-black p-3">{item.inflow}</td>
                  <td className="border border-black p-3">{formatAmount(item.subsPrevYr)}</td>
                  <td className="border border-black p-3">{formatAmount(item.subsCurYr)}</td>
                  <td className="border border-black p-3">{formatAmount(item.otherReceipts)}</td>
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
              <td className="border border-black p-3" colSpan={2}>
                Total
              </td>
              <td className="border border-black p-3">{columnTotals.inflow}</td>
              <td className="border border-black p-3">{formatAmount(columnTotals.subsPrevYr)}</td>
              <td className="border border-black p-3">{formatAmount(columnTotals.subsCurYr)}</td>
              <td className="border border-black p-3">{formatAmount(columnTotals.otherReceipts)}</td>
              <td className="border border-black p-3">{formatAmount(columnTotals.total)}</td>
              <td className="border border-black p-3">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InflowPage;
