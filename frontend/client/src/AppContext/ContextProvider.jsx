import { useState, createContext } from 'react';
import { FaCalendarAlt, FaMoneyBillWave, FaExclamationTriangle, FaBell } from 'react-icons/fa';

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
  const [systemNotifications] = useState([
    {
      id: 1,
      type: "fd-maturity",
      title: "FD Maturing Soon",
      message: "FDR001 worth ₹1,00,000 is maturing on 10th Jan 2024",
      date: "2023-12-27",
      icon: FaCalendarAlt,
      priority: "high"
    },
    {
      id: 2,
      type: "payment-due",
      title: "Payment Due",
      message: "Pending payment of ₹50,000 for Unit ABC due in 3 days",
      date: "2023-12-26",
      icon: FaMoneyBillWave,
      priority: "medium"
    },
    {
      id: 3,
      type: "low-balance",
      title: "Low Balance Alert",
      message: "Account balance for Unit XYZ is below minimum threshold",
      date: "2023-12-26",
      icon: FaExclamationTriangle,
      priority: "high"
    },
    {
      id: 4,
      type: "fd-interest",
      title: "Interest Credit",
      message: "Interest of ₹10,000 credited for FDR002",
      date: "2023-12-25",
      icon: FaBell,
      priority: "low"
    }
  ]);

  return (
    <AppContext.Provider value={{
      units,
      setUnits,
      fdrs,
      setFdrs,
      allPayments,
      setAllPayments,
      receipts,
      setReceipts,
      payments,
      setPayments,
      systemNotifications,
      setSystemNotifications: () => {} // Add empty setter to avoid errors
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
