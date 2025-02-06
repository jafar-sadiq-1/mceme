import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';

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

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/receipts" element={<ReceiptsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/balance-sheet" element={<BalanceSheetPage />} />
          <Route path="/brs" element={<BRSPage />} />
          <Route path="/inflow" element={<InflowPage />} />
          <Route path="/outflow" element={<OutFlowPage />} />
          <Route path="/comparison" element={<ComparisionPage />} />
          <Route path="/fdr" element={<FDRPage />} />
          <Route path="/sy-dr" element={<SyDrPage />} />
          <Route path='/users-requests' element={<UsersAndRequestPage/>}/>
          <Route path='/change-password' element={<ChangePasswordPage/>}/>
          <Route path='/units' element={<UnitsPage/>}/>
          <Route path='/allpayments' element={<AllPaymentsPage/>}/>
          <Route path='/allreceipts' element={<AllReceiptsPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
