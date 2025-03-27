import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFinancialYears = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/financialYears');
        const years = response.data.map(fy => fy.financialYear);
        setFinancialYears(years.sort().reverse()); // Sort in descending order
      } catch (error) {
        setError('Failed to fetch financial years');
        console.error('Error fetching financial years:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialYears();
  }, []);

  return { financialYears, loading, error };
};
