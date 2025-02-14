import React, { useEffect } from "react";
import Header from '../components/Header';

export default function BalanceSheet() {
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
    
  const assets = [
    { name: "Cash in Hand", amount: 500000000},
    { name: "Cash in Bank", amount: 20000 },
    { name: "FDR", amount: 15000 },
    { name: "Sy Dr", amount: 10000 },
    { name: "Property", amount: 75000 },
  ];

  const liabilities = [
    { name: "EME Journal Fund", amount: 25000000 },
    { name: "Property", amount: 50000 },
    { name:"Sy Cr" , amount: 0}
  ];

  const maxRows = Math.max(assets.length, liabilities.length);

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
      <Header/>
      <div className="mt-8 mb-8 flex justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-auto">
          <div id="print">
            <h2 className="text-2xl font-bold text-black mb-4 text-center">
              Balance Sheet
            </h2>
            <table className="table-auto w-full border-collapse border border-gray-300" style={{ fontFamily: 'Times New Roman, serif' }}>
              <thead>
                <tr className="bg-violet-400 text-black">
                  <th className="px-4 py-2 border border-gray-300">Assets</th>
                  <th className="px-4 py-2 border border-gray-300">Amount</th>
                  <th className="px-4 py-2 border border-gray-300">Liabilities</th>
                  <th className="px-4 py-2 border border-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxRows }).map((_, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-violet-50' : 'bg-white'}
                  >
                    {/* Assets */}
                    <td className="px-4 py-2 border border-gray-300">
                      {assets[index]?.name || ""}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-right">
                      {assets[index]?.amount?.toLocaleString() || ""}
                    </td>
                    {/* Liabilities */}
                    <td className="px-4 py-2 border border-gray-300">
                      {liabilities[index]?.name || ""}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-right">
                      {liabilities[index]?.amount?.toLocaleString() || ""}
                    </td>
                  </tr>
                ))}
                <tr className="bg-white">
                    {/* Assets */}
                    <td className="px-4 py-2 border border-gray-300">
                      Total
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-right">
                      0
                    </td>
                    {/* Liabilities */}
                    <td className="px-4 py-2 border border-gray-300">
                      Total
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-right">
                      0
                    </td>
                  </tr>
              </tbody>
            </table>
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
}