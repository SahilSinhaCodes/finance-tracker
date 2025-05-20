import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddTransaction from '../components/AddTransaction';

const Home = () => {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    console.log('Fetching with token:', token); // Optional: debug
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
  }, [token]); // ✅ Wait for token to be available

  const handleAddTransaction = (newTransaction) => {
    setTransactions((prev) => [...prev, newTransaction]);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Transactions</h1>

      <AddTransaction onAdd={handleAddTransaction} />

      <ul className="mt-6 space-y-4">
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map((t) => (
            <li key={t._id} className="border p-3 rounded">
              <p>
                <strong>{t.type.toUpperCase()}</strong> - ${t.amount} - {t.category}
              </p>
              <p>{t.description}</p>
              <p>{new Date(t.date).toLocaleDateString()}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Home;
