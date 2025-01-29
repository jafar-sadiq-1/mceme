import React from "react";

const ComparisionPage = () => {
  const funds = [
    { name: "Cash in Hand", assets: 30000000.45, liabilities: 15000000.55, income: 40000000.7, expenditure: 35000000.85 },
    { name: "Cash in Bank", assets: 2000.3, liabilities: 1000.4, income: 3000.6, expenditure: 2500.5 },
    { name: "FDRs", assets: 3000.45, liabilities: 1500.55, income: 4000.7, expenditure: 3500.85 },
    { name: "Sy Dr", assets: 4000.95, liabilities: 2000.65, income: 5000.8, expenditure: 4500.9 },
    { name: "Property", assets: 5000.25, liabilities: 2500.15, income: 6000.35, expenditure: 5500.05 },
    { name: "EME Journal", assets: 6000.85, liabilities: 3000.75, income: 7000.95, expenditure: 6500.85 },
  ];

  const totals = funds.reduce(
    (acc, fund) => ({
      assets: acc.assets + fund.assets,
      liabilities: acc.liabilities + fund.liabilities,
      income: acc.income + fund.income,
      expenditure: acc.expenditure + fund.expenditure,
      increase: acc.increase + (fund.income - fund.expenditure),
      decrease: acc.decrease + (fund.assets - fund.liabilities),
    }),
    { assets: 0, liabilities: 0, income: 0, expenditure: 0, increase: 0, decrease: 0 }
  );

  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString("default", {
    month: "short",
    year: "2-digit",
  });

  const previousMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1
  );
  const previousMonthYear = previousMonthDate.toLocaleString("default", {
    month: "short",
    year: "2-digit",
  });

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-6">Balance Sheet Comparison</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-700" style={{ tableLayout: "auto" }}>
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-black p-3 whitespace-nowrap">Ser No</th>
              <th className="border border-black p-3 whitespace-nowrap">Name of Fund</th>
              <th className="border border-black p-3 whitespace-nowrap">
                Bal for the Month {`(${previousMonthYear})`}
                <div className="grid grid-cols-2 divide-x divide-black mt-1">
                  <span className="text-center">Assets (Rs)</span>
                  <span className="text-center">Liabilities (Rs)</span>
                </div>
              </th>
              <th className="border border-black p-3 whitespace-nowrap">Income in Present Month (Rs)</th>
              <th className="border border-black p-3 whitespace-nowrap">Expdr in Present Month (Rs)</th>
              <th className="border border-black p-3 whitespace-nowrap">
                Bal for the Month {`(${currentMonthYear})`}
                <div className="grid grid-cols-2 divide-x divide-black mt-1">
                  <span className="text-center">Assets (Rs)</span>
                  <span className="text-center">Liabilities (Rs)</span>
                </div>
              </th>
              <th className="border border-black p-3 whitespace-nowrap">Incr (+)</th>
              <th className="border border-black p-3 whitespace-nowrap">Decr (-)</th>
              <th className="border border-black p-3 whitespace-nowrap">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund, index) => (
              <tr key={index} className="text-center">
                <td className="border border-black p-3 whitespace-nowrap">{index + 1}</td>
                <td className="border border-black p-3 whitespace-nowrap">{fund.name}</td>
                <td className="border border-black p-3 whitespace-nowrap">
                  <div className="grid grid-cols-2 divide-x divide-black">
                    <span className="text-center">{fund.assets.toFixed(2)}</span>
                    <span className="text-center">{fund.liabilities.toFixed(2)}</span>
                  </div>
                </td>
                <td className="border border-black p-3 whitespace-nowrap">{fund.income.toFixed(2)}</td>
                <td className="border border-black p-3 whitespace-nowrap">{fund.expenditure.toFixed(2)}</td>
                <td className="border border-black p-3 whitespace-nowrap">
                  <div className="grid grid-cols-2 divide-x divide-black">
                    <span className="text-center">
                      {(fund.assets + fund.income - fund.expenditure).toFixed(2)}
                    </span>
                    <span className="text-center">{fund.liabilities.toFixed(2)}</span>
                  </div>
                </td>
                <td className="border border-black p-3 whitespace-nowrap">
                  {(fund.income - fund.expenditure).toFixed(2)}
                </td>
                <td className="border border-black p-3 whitespace-nowrap">
                  {(fund.assets - fund.liabilities).toFixed(2)}
                </td>
                <td className="border border-black p-3">
                  <input
                    type="text"
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
              <td className="border border-black p-3 whitespace-nowrap">
                <div className="grid grid-cols-2 divide-x divide-black">
                  <span className="text-center">{totals.assets.toFixed(2)}</span>
                  <span className="text-center">{totals.liabilities.toFixed(2)}</span>
                </div>
              </td>
              <td className="border border-black p-3 whitespace-nowrap">{totals.income.toFixed(2)}</td>
              <td className="border border-black p-3 whitespace-nowrap">{totals.expenditure.toFixed(2)}</td>
              <td className="border border-black p-3 whitespace-nowrap">
                <div className="grid grid-cols-2 divide-x divide-black">
                  <span className="text-center">
                    {(totals.assets + totals.income - totals.expenditure).toFixed(2)}
                  </span>
                  <span className="text-center">{totals.liabilities.toFixed(2)}</span>
                </div>
              </td>
              <td className="border border-black p-3 whitespace-nowrap">{totals.increase.toFixed(2)}</td>
              <td className="border border-black p-3 whitespace-nowrap">{totals.decrease.toFixed(2)}</td>
              <td className="border border-black p-3">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisionPage;
