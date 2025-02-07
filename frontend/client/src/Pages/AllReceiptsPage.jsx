import Header from '../components/Header';

export default function AllReceiptsPage() {
  const payments = [
    { SNo: 1, Date: "01.02.2024", Month: "Feb-2024", RVNo: "PV123", UnitName: "Unit A", TypeOfReceipt: "Online", Amount: "₹5,000" },
    { SNo: 2, Date: "15.03.2024", Month: "Mar-2024", RVNo: "PV124", UnitName: "Unit B", TypeOfReceipt: "Cash", Amount: "₹3,200" },
    { SNo: 3, Date: "10.04.2024", Month: "Apr-2024", RVNo: "PV125", UnitName: "Unit C", TypeOfReceipt: "Cheque", Amount: "₹7,500" },
  ];

  return (
    <>
      <Header />
      <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen">
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-3xl mb-4  text-center" style={{ color: '#6A1D8F' }}>All Receipts of 2024</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border p-2">SNo</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Month</th>
                <th className="border p-2">RV No</th>
                <th className="border p-2">Unit Name</th>
                <th className="border p-2">Type of Receipt</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((receipt, index) => (
                <tr key={index} className="odd:bg-gray-100 even:bg-white">
                  <td className="border p-2 text-center">{receipt.SNo}</td>
                  <td className="border p-2 text-center">{receipt.Date}</td>
                  <td className="border p-2 text-center">{receipt.Month}</td>
                  <td className="border p-2 text-center">{receipt.RVNo}</td>
                  <td className="border p-2 text-center">{receipt.UnitName}</td>
                  <td className="border p-2 text-center">{receipt.TypeOfReceipt}</td>
                  <td className="border p-2 text-center">{receipt.Amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
