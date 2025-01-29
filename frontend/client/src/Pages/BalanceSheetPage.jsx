import React from "react";

export default function BalanceSheet() {
  const assets = [
    { name: "Cash in Hand", amount: 5000 },
    { name: "Cash in Bank", amount: 20000 },
    { name: "FDR", amount: 15000 },
    { name: "Sy Dr", amount: 10000 },
    { name: "Property", amount: 75000 },
  ];

  const liabilities = [
    { name: "EME Journal Fund", amount: 25000 },
    { name: "Property", amount: 50000 },
    {name:"Sy Cr" , amount: 0}
  ];

  const maxRows = Math.max(assets.length, liabilities.length);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        Balance Sheet
      </h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-600 text-white">
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
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
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
  );
}
