import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddTransaction from '../components/AddTransaction';
import TransactionFilters from '../components/TransactionFilters';
import Charts from '../components/Charts';

const Home = () => {
  const { token, logout } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch transactions');
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const handleAddTransaction = (newTransaction) => {
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete');
    }
  };

  // Filter logic
  const filteredTransactions = transactions.filter((t) => {
    const matchType = filterType === 'all' || t.type === filterType;
    const matchCategory =
      filterCategory.trim() === '' ||
      t.category.toLowerCase().includes(filterCategory.trim().toLowerCase());
    const matchDate =
      filterDate === '' || new Date(t.date).toISOString().slice(0, 10) === filterDate;

    return matchType && matchCategory && matchDate;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Your Transactions</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>

      <AddTransaction onAdd={handleAddTransaction} />

      {/* Filter component */}
      <TransactionFilters
        filterType={filterType}
        filterCategory={filterCategory}
        filterDate={filterDate}
        setFilterType={setFilterType}
        setFilterCategory={setFilterCategory}
        setFilterDate={setFilterDate}
      />

      {/* Transaction List */}
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
                  <p>
                    {new Intl.DateTimeFormat('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(t.date))}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <Charts transactions={filteredTransactions} />
    </div>
  );
};

export default Home;
