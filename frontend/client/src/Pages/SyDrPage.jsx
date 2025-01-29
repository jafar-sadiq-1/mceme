import React, { useState } from 'react';

// Function to format the date as "31 May 2024"
const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }); // Gets the abbreviated month (e.g., "May")
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const SyDrPage = () => {
  const [remarks, setRemarks] = useState([]);

  const data = [
    { srNo: 1, unitName: 'Unisfsalkdjfdsajft 1', amt: 1000000090909.00 },
    { srNo: 2, unitName: 'Unit 2', amt: 200.07 },
    { srNo: 3, unitName: 'Unit 3', amt: 300.08},
    { srNo: 4, unitName: 'Unit 4', amt: 400.00 },
  ];

  // Calculate total and format to two decimals
  const totals = data.reduce(
    (acc, item) => ({
      amt: acc.amt + item.amt,
    }),
    { amt: 0 }
  );

  // Function to format the amount to two decimals
  const formatAmount = (amt) => amt.toFixed(2);

  const handleRemarkChange = (index, value) => {
    const newRemarks = [...remarks];
    newRemarks[index] = value;
    setRemarks(newRemarks);
  };

  // Get the current date in the format "31 May 2024"
  const currentDate = new Date();
  const currentdate = formatDate(currentDate);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-6">List of Sy Dr on {currentdate}</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-700">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-black p-3">Sr No</th>
              <th className="border border-black p-3">Name of the Unit</th>
              <th className="border border-black p-3">Amt</th>
              <th className="border border-black p-3">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border border-black p-3">{item.srNo}</td>
                <td className="border border-black p-3">{item.unitName}</td>
                <td className="border border-black p-3">{formatAmount(item.amt)}</td>
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
            {/* Total Row */}
            <tr className="text-center font-bold bg-gray-200">
              <td className="border border-black p-3" colSpan={2}>
                Total
              </td>
              <td className="border border-black p-3">{formatAmount(totals.amt)}</td>
              <td className="border border-black p-3">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SyDrPage;
