import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddTransaction = ({ onAdd }) => {
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
    date: '',
  });

  const { type, amount, category, description, date } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !category || !date) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const res = await axios.post(
        'https://finance-tracker-api-uhav.onrender.com/api/transactions',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // ✅ Fix here
          },
        }
      );
//      alert('Transaction added!');
      onAdd(res.data);
      setFormData({ type: 'income', amount: '', category: '', description: '', date: '' });
    } catch (error) {
      console.error(error);
      alert('Error adding transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded space-y-4">
      <div>
        <label className="block mb-1">Type</label>
        <select name="type" value={type} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Amount *</label>
        <input
          type="number"
          name="amount"
          value={amount}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Category *</label>
        <input
  type="text"
  name="category"
  value={category}
  onChange={handleChange}
  onKeyDown={(e) => {
    // Block number keys (top row and numpad)
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
    }
  }}
  required
  className="w-full p-2 border rounded"
  placeholder="e.g., Food, Salary"
/>
      </div>

      <div>
        <label className="block mb-1">Description</label>
        <input
          type="text"
          name="description"
          value={description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block mb-1">Date *</label>
        <input
          type="date"
          name="date"
          value={date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Transaction
      </button>
    </form>
  );
};

export default AddTransaction;