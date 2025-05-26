import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddTransaction from '../components/AddTransaction';
import TransactionFilters from '../components/TransactionFilters';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { generatePDF } from '../utils/generatePDF';

const Transactions = () => {
  const { token, logout, user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        setTimeout(() => navigate('/login'), 100);
      } else {
        toast.error('Failed to fetch transactions');
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const handleAddTransaction = (newTransaction) => {
    setTransactions((prev) => [...prev, newTransaction]);
    toast.success('Transaction added successfully!');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      toast.success('Transaction deleted successfully!');
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete transaction');
    }
  };

  // Filtering logic
  const filteredTransactions = transactions.filter((t) => {
    const matchType = filterType === 'all' || t.type === filterType;
    const matchCategory =
      filterCategory.trim() === '' ||
      t.category.toLowerCase().includes(filterCategory.trim().toLowerCase());
    const matchDate =
      filterDate === '' ||
      new Date(t.date).toISOString().slice(0, 10) === filterDate;

    return matchType && matchCategory && matchDate;
  });

  console.log("User object from context:", user);

  return (
    <div>
      <Navbar />
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Manage Transactions
          </h1>
        </div>

        {/* Add Transaction */}
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-2">Add New Transaction</h2>
          <AddTransaction onAdd={handleAddTransaction} />
        </div>

        {/* Filters */}
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-2">Filters</h2>
          <TransactionFilters
            filterType={filterType}
            filterCategory={filterCategory}
            filterDate={filterDate}
            setFilterType={setFilterType}
            setFilterCategory={setFilterCategory}
            setFilterDate={setFilterDate}
          />
        </div>

        {/* Download Statement */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => generatePDF(filteredTransactions, user?.name || 'Unknown User')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Statement
          </button>
        </div>

        {/* Transactions List */}
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-2">Transaction List</h2>
          <ul className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <p>No transactions match the filter.</p>
            ) : (
              filteredTransactions.map((t) => (
                <li key={t._id} className="border p-3 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <p>
                        <strong>{t.type.toUpperCase()}</strong> –{' '}
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        }).format(t.amount)}{' '}
                        – {t.category}
                      </p>
                      <p>{t.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Intl.DateTimeFormat('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }).format(new Date(t.date))}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
