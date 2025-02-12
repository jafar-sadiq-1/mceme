import React, { useState, createContext } from 'react';

export const AppContext = createContext();

const ContextProvider = ({ children }) => {  // Destructure children
  const [units,setUnits] = useState([]);
  const [fdrs,setFdrs] = useState([
    {
      sno: 1,
      fdrNo: "FDR001",
      dateOfDeposit: "2023-01-10",
      amount: 100000,
      maturityValue: 110000,
      maturityDate: "2024-01-10",
      duration: "12 months",
      intRate: 10,
      interestAmount: 10000,
      remarks: "",
      bank: "Bank A",
    },
    {
      sno: 2,
      fdrNo: "FDR002",
      dateOfDeposit: "2023-03-15",
      amount: 50000,
      maturityValue: 53000,
      maturityDate: "2024-03-15",
      duration: "12 months",
      intRate: 6,
      interestAmount: 3000,
      remarks: "",
      bank: "Bank B",
    },
    {
      sno: 3,
      fdrNo: "FDR003",
      dateOfDeposit: "2023-06-01",
      amount: 200000,
      maturityValue: 218000,
      maturityDate: "2024-06-01",
      duration: "12 months",
      intRate: 9,
      interestAmount: 18000,
      remarks: "",
      bank: "Bank C",
    },
  ]);
  const [allPayments , setAllPayments] = useState([]);
  const [receipts , setReceipts] = useState([]);
  const [payments , setPayments] = useState([]);

  return (
    <AppContext.Provider value={{units,setUnits,fdrs,setFdrs, allPayments , setAllPayments,receipts , setReceipts, payments , setPayments}}>    
      {children} 
    </AppContext.Provider>
  );
};

export default ContextProvider;
