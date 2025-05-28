import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddTransaction from '../components/AddTransaction';
import TransactionFilters from '../components/TransactionFilters';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { generatePDF } from '../utils/generatePDF';
import {
  FileText,
  PlusCircle,
  Filter,
  ListOrdered,
} from 'lucide-react';
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2 mb-2">
            <FileText className="w-6 h-6 text-green-600" />
            Manage Transactions
          </h1>
        </div>

        {/* Add Transaction */}
        <div className="my-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-3">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            Add New Transaction
          </h2>

          <AddTransaction onAdd={handleAddTransaction} />
        </div>

        {/* Filters */}
        <div className="my-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-purple-600" />
            Filters
          </h2>

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
        {/* Transactions List */}
        <div className="my-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <ListOrdered className="w-5 h-5 text-yellow-600" />
            Transaction List
          </h2>
          
          {filteredTransactions.length === 0 ? (
            <p className="text-gray-500">No transactions match the filter.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTransactions.map((t) => (
                <li
                  key={t._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-lg font-semibold ${
                          t.type === 'income' ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        }).format(t.amount)}
                      </span>
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm mb-1">{t.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Intl.DateTimeFormat('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }).format(new Date(t.date))}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-sm text-red-600 hover:underline mt-3 self-end"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default Transactions;