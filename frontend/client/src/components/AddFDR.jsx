import React from 'react';
import axios from 'axios'; // Import Axios

const AddForm = ({ newFdr, setNewFdr }) => {
  
  const handleAddFdr = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/fdr', newFdr, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('FDR added successfully:', response.data);

      // Clear form after successful submission
      setNewFdr({
        fdrNo: '',
        dateOfDeposit: '',
        amount: '',
        maturityValue: '',
        maturityDate: '',
        duration: '',
        intRate: '',
        interestAmount: '',
        bank: '',
        remarks: '',
      });

      alert('FDR added successfully!');
    } catch (error) {
      console.error('Error adding FDR:', error);
      alert('Failed to add FDR');
    }
  };

  return (
    <button
      onClick={handleAddFdr}
      className="bg-blue-500 border-1 border-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition-transform duration-200">
      Add FDR
    </button>
  );
};

export default AddForm;
