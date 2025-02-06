import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import TokenExpiry from './TokenExpiry';
import HomePage from './Pages/HomePage';
import ReceiptsPage from './Pages/ReceiptsPage';
import PaymentsPage from './Pages/PaymentsPage';
import BalanceSheetPage from './Pages/BalanceSheetPage';
import FDRPage from './Pages/FDRPage';
import LoginPage from './Pages/LoginPage';
import BRSPage from './Pages/BRSPage';
import InflowPage from './Pages/InflowPage';
import OutFlowPage from './Pages/OutflowPage';
import ComparisionPage from './Pages/ComparisionPage';
import SyDrPage from './Pages/SyDrPage';
import UsersAndRequestPage from './Pages/UsersAndRequestPage';
import ChangePasswordPage from './Pages/ChangePasswordPage';
import Header from './components/Header';
import UnitsPage from './Pages/UnitsPage';
import AllPaymentsPage from './Pages/AllPaymentsPage';
import AllReceiptsPage from './Pages/AllReceiptsPage';
import ProtectedRoute from './Pages/ProtectedRoute';

function App() {
  TokenExpiry();
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/receipts" element={<ProtectedRoute><ReceiptsPage /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
          <Route path="/balance-sheet" element={<ProtectedRoute><BalanceSheetPage /></ProtectedRoute>} />
          <Route path="/brs" element={<ProtectedRoute><BRSPage /></ProtectedRoute>} />
          <Route path="/inflow" element={<ProtectedRoute><InflowPage /></ProtectedRoute>} />
          <Route path="/outflow" element={<ProtectedRoute><OutFlowPage /></ProtectedRoute>} />
          <Route path="/comparison" element={<ProtectedRoute><ComparisionPage /></ProtectedRoute>} />
          <Route path="/fdr" element={<ProtectedRoute><FDRPage /></ProtectedRoute>} />
          <Route path="/sy-dr" element={<ProtectedRoute><SyDrPage /></ProtectedRoute>} />
          <Route path='/users-requests' element={<ProtectedRoute><UsersAndRequestPage /></ProtectedRoute>} />
          <Route path='/change-password' element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
          <Route path='/units' element={<ProtectedRoute><UnitsPage /></ProtectedRoute>} />
          <Route path='/allpayments' element={<ProtectedRoute><AllPaymentsPage /></ProtectedRoute>} />
          <Route path='/allreceipts' element={<ProtectedRoute><AllReceiptsPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
