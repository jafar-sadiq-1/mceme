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
  ];
  return (
    <>
      {/* <Header /> */}
      <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {buttons.map(({ path, text }, index) => (
          <button
            key={index}
            onClick={() => navigate(path)}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {text}
          </button>
        ))}
      </div>
    </div>

    </>
  );
};

export default HomePage;
