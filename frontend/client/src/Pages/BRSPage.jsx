import React from "react";

const BRSPage = () => {
  const funds = [
    { cashInBank: 2000.3, liabilities: 1000.4 },
    { cashInBank: 200.3, liabilities: 100.4 },
  ];

  // Calculate totals for the two columns
  const totals = funds.reduce(
    (acc, fund) => ({
      cashInBank: acc.cashInBank + fund.cashInBank,
      liabilities: acc.liabilities + fund.liabilities,
    }),
    { cashInBank: 0, liabilities: 0 }
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-6">Bank Reconciliation Statement (BRS)</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-700" style={{ tableLayout: "auto" }}>
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-black p-3">Balance as per Bank Statement</th>
              <th className="border border-black p-3">Balance as per Ledger</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund, index) => (
              <tr key={index} className="text-center">
                <td className="border border-black p-3">
                  <div className="grid grid-cols-2 divide-x divide-black">
                    <span className="text-center">Cash in Bank</span>
                    <span className="text-center">{fund.cashInBank.toFixed(2)}</span>
                  </div>
                </td>
                <td className="border border-black p-3">
                  <div className="grid grid-cols-2 divide-x divide-black">
                    <span className="text-center">EME Journal Acct</span>
                    <span className="text-center">{fund.liabilities.toFixed(2)}</span>
                  </div>
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="text-center font-bold bg-gray-200">
         
              <td className="border border-black p-3">
                <div className="grid grid-cols-2 divide-x divide-black">
                  <span className="text-center">Total Cash in Bank</span>
                  <span className="text-center">{totals.cashInBank.toFixed(2)}</span>
                </div>
              </td>
              <td className="border border-black p-3">
                <div className="grid grid-cols-2 divide-x divide-black">
                  <span className="text-center">Total Liabilities</span>
                  <span className="text-center">{totals.liabilities.toFixed(2)}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BRSPage;
