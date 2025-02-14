import React, { useState,useEffect } from 'react';
import Header from '../components/Header'; 

// Function to format the date as "31 May 2024"
const formatDate = (date) => {
  useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
         @media print {
          body::before {
            content: "EME Journal";
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 80px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.1);
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
            mix-blend-mode: multiply; /* Ensures it blends with table background */
          }
        }
        `;
        document.head.appendChild(style);
        return () => {
          document.head.removeChild(style); // Cleanup
        };
      }, []);
      
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="py-10 flex justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-auto">
          <div id="print">
            <h1 className="text-center text-2xl font-bold mb-6">
              Inflow Statement for the month of {currentMonthYear}
            </h1>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300" >
                <thead className="bg-violet-400 text-black">
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
        </div>
        </div>
        <div className="flex justify-center">
          <button onClick={handlePrint} className="bg-green-500 border border-black text-black px-4 py-2 rounded hover:bg-green-600 hover:scale-110 transition-transform duration-200">
            Print
          </button>
        </div>
      </div>
    </>
  );
};

export default InflowPage;