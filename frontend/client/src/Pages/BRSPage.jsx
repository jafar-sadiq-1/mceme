import React, { useEffect } from "react";
import Header from "../components/Header";

const BRSPage = () => {
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
          }
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style); // Cleanup
      };
    }, []);

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
      <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100 font-serif">
        <Header />
        <div className="mt-8 mb-8 flex justify-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-auto">
           <div id="print">
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
        <div className="flex justify-center mt-6">
          <button onClick={handlePrint} className="bg-green-500 border border-black text-black px-4 py-2 rounded hover:bg-green-600 hover:scale-110 transition-transform duration-200">
            Print
          </button>
        </div>
      </div>
    </>
  );
};

export default BRSPage;