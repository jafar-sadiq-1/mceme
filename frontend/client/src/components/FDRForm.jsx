import React,{useState} from "react";
import AddFDR from "./AddFDR";
import UpdateFDR from "./UpdateFDR";
import DeleteFDR from "./DeleteFDR";


function FDRForm() {
  const [newFdr, setNewFdr] = useState({
    fdrNo: "",
    dateOfDeposit: "",
    amount: "",
    maturityValue: "",
    maturityDate: "",
    duration: "",
    intRate: "",
    interestAmount: "",
    bank: "",
    remarks: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFdr({
      ...newFdr,
      [name]: value,
    });
  };

  return (
    <>
      <h2 className="mt-3 text-2xl font-serif text-black mb-4">Manage FDR</h2>
      <form className="space-y-4">
        {[
          { label: "FDR No", name: "fdrNo", type: "text" },
          { label: "Date of Deposit", name: "dateOfDeposit", type: "date" },
          { label: "Amount", name: "amount", type: "number" },
          { label: "Maturity Value", name: "maturityValue", type: "number" },
          { label: "Maturity Date", name: "maturityDate", type: "date" },
          { label: "Duration", name: "duration", type: "text" },
          { label: "Int Rate %", name: "intRate", type: "number" },
          { label: "Interest Amount", name: "interestAmount", type: "number" },
          { label: "Bank", name: "bank", type: "text" },
          { label: "Remarks", name: "remarks", type: "text" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-gray-700 font-medium mb-1">
              {field.label}:
            </label>
            <input
              type={field.type}
              name={field.name}
              value={newFdr[field.name]}
              onChange={handleInputChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        ))}

        <div className="flex space-x-4">
          <AddFDR newFdr={newFdr}/>
          <UpdateFDR newFdr={newFdr}/>
          <DeleteFDR newFdr={newFdr}/>
        </div>
      </form>
    </>
  );
}

export default FDRForm;
