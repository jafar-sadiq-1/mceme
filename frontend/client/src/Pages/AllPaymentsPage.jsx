import Header from '../components/Header';
import React, { useEffect } from "react";

export default function AllPaymentsPage() {
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

  const payments = [
    { SNo: 1, Date: "01.02.2024", Month: "Feb-2024", PVNo: "PV123", UnitName: "Unit A", TypeOfPayment: "Online", Amount: "₹5,000" },
    { SNo: 2, Date: "15.03.2024", Month: "Mar-2024", PVNo: "PV124", UnitName: "Unit B", TypeOfPayment: "Cash", Amount: "₹3,200" },
    { SNo: 3, Date: "10.04.2024", Month: "Apr-2024", PVNo: "PV125", UnitName: "Unit C", TypeOfPayment: "Cheque", Amount: "₹7,500" },
  ];

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
      <div className="p-6 bg-gradient-to-r from-teal-100 to-violet-100 min-h-screen" style={{ fontFamily: 'Times New Roman, serif' }}>
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
          <div id="print">
            <h2 className="text-3xl mb-4  text-center" style={{ color: '#6A1D8F' }}>All Payments of 2024</h2>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-violet-400 text-black">
                  <th className="border p-2">SNo</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Month</th>
                  <th className="border p-2">PV No</th>
                  <th className="border p-2">Unit Name</th>
                  <th className="border p-2">Type of Payment</th>
                  <th className="border p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-violet-50' : 'bg-white'}>
                    <td className="border p-2 text-center">{payment.SNo}</td>
                    <td className="border p-2 text-center">{payment.Date}</td>
                    <td className="border p-2 text-center">{payment.Month}</td>
                    <td className="border p-2 text-center">{payment.PVNo}</td>
                    <td className="border p-2 text-center">{payment.UnitName}</td>
                    <td className="border p-2 text-center">{payment.TypeOfPayment}</td>
                    <td className="border p-2 text-center">{payment.Amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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