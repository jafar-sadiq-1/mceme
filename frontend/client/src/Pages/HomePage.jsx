import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const buttons = [
    { text: 'Receipts', path: '/receipts' },
    { text: 'Payments', path: '/payments' },
    { text: 'Balance Sheet', path: '/balance-sheet' },
    { text: 'BRS', path: '/brs' },
    { text: 'Inflow', path: '/inflow' },
    { text: 'Outflow', path: '/outflow' },
    { text: 'Comparison', path: '/comparison' },
    { text: 'FDR', path: '/fdr' },
    { text: 'SY DR', path: '/sy-dr' },
    { text: 'Units', path: '/units' },
    { text: 'All Payments', path: '/allpayments' },
    { text: 'All Receipts', path: '/allreceipts' },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-violet-100 flex flex-col">
      <Header />
      {/* Center content */}
      <div className="flex flex-grow items-center justify-center">
        {/* Grid for buttons */}
        <div className="grid grid-cols-3 gap-8 p-8 max-w-5xl text-center">
          {buttons.map(({ path, text }, index) => (
            <button
            key={index}
            onClick={() => navigate(path)}
            className="p-6 text-xl font-serif bg-green-400 text-black border-2 border-black rounded-2xl hover:scale-110 hover:bg-green-500 transition-transform duration-200"
          >
            {text}
          </button>
          
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
