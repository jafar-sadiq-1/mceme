import React from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";


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
    { name: "Sy Cr", amount: 0 },
  ];

  const maxRows = Math.max(assets.length, liabilities.length);

  const exportToExcel = () => {
    const data = [];
    const header = ["Assets", "Amount", "Liabilities", "Amount"];
    data.push(header);

    for (let i = 0; i < maxRows; i++) {
      const asset = assets[i] || {};
      const liability = liabilities[i] || {};
      const row = [
        asset.name || "",
        asset.amount || "",
        liability.name || "",
        liability.amount || "",
      ];
      data.push(row);
    }

    const ws = XLSX.utils.aoa_to_sheet(data);

    const colWidths = [
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
    ];
    ws['!cols'] = colWidths;

    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = ws[XLSX.utils.encode_cell({ r: 0, c: col })];
      if (cell) {
        cell.s = { font: { bold: true } };
      }
    }

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell) {
          cell.s = {
            border: {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BalanceSheet");

    XLSX.writeFile(wb, "BalanceSheet.xlsx");
  };

  // Function to print balance sheet
  const handlePrint = () => {
    const printContents = document.getElementById("balanceSheet").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Ensure the balance sheet content is in a format jsPDF can handle.
    const element = document.getElementById("balanceSheet");
  
    // Using html2canvas for rendering the HTML before passing to jsPDF
    html2canvas(element, {
      scale: 2,  // Improve rendering quality
      useCORS: true,  // Enable cross-origin requests for images and other assets
    }).then((canvas) => {
      // Add the canvas image to the PDF document
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 10);
      doc.save("BalanceSheet.pdf");  // Save the PDF
    });
  };
  
  

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-8">
        <div id="balanceSheet">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
            Balance Sheet
          </h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-black">
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
                <td className="px-4 py-2 border border-gray-300">Total</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
                {/* Liabilities */}
                <td className="px-4 py-2 border border-gray-300">Total</td>
                <td className="px-4 py-2 border border-gray-300 text-right">0</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Buttons */}
        <button
          onClick={exportToExcel}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Export to Excel
        </button>
        <button
          onClick={handlePrint}
          className="mt-4 ml-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Print
        </button>
        <button
          onClick={generatePDF}
          className="mt-4 ml-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
