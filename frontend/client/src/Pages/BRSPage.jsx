import React from "react";
import Header from "../components/Header";

const BRSPage = () => {
  const funds = [
    { cashInBank: 20000000000.3, liabilities: 1000000000000000.4 },
    { cashInBank: 2000000000000000.3, liabilities: 100000000000000000000.4 },
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
    <>
      <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100 font-serif">
        <Header />
        <div className="mt-8 mb-8 flex justify-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-auto">
            <h1 className="text-2xl font-bold text-black mb-4 text-center">
              Bank Reconciliation Statement (BRS)
            </h1>
            <div className="overflow-x-auto">
              <table
                className="table-auto w-full border-collapse border border-gray-300"
                style={{ fontFamily: "Times New Roman, serif" }}
              >
                <thead className="bg-violet-400 text-black">
                  <tr>
                    <th className="border border-black p-3">
                      Balance as per Bank Statement
                    </th>
                    <th className="border border-black p-3">
                      Balance as per Ledger
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {funds.map((fund, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-black p-3">
                        <div className="grid grid-cols-2">
                          <span className="text-center pr-2">Cash in Bank</span>
                          <span
                            className="text-center border-l-2 border-dashed"
                            style={{ paddingLeft: "10px" }}
                          >
                            {fund.cashInBank.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="border border-black p-3">
                        <div className="grid grid-cols-2">
                          <span className="text-center pr-2">
                            EME Journal Acct
                          </span>
                          <span
                            className="text-center border-l-2 border-dashed"
                            style={{ paddingLeft: "10px" }}
                          >
                            {fund.liabilities.toFixed(2)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="text-center font-bold bg-gray-200">
                    <td className="border border-black p-3">
                      <div className="grid grid-cols-2">
                        <span className="text-center pr-2">
                          Total Cash in Bank
                        </span>
                        <span
                          className="text-center border-l-2 border-dashed"
                          style={{ paddingLeft: "10px" }}
                        >
                          {totals.cashInBank.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="border border-black p-3">
                      <div className="grid grid-cols-2">
                        <span className="text-center pr-2">
                          Total Liabilities
                        </span>
                        <span
                          className="text-center border-l-2 border-dashed"
                          style={{ paddingLeft: "10px" }}
                        >
                          {totals.liabilities.toFixed(2)}
                        </span>
                      </div>
                    </td>
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

export default BRSPage;
