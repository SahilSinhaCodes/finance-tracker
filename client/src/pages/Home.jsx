import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Charts from '../components/Charts';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const { token, logout, user } = useContext(AuthContext); // add `user`
  const [transactions, setTransactions] = useState([]);
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
        alert('Session expired. Please log in again.');
        logout();
        setTimeout(() => navigate('/login'), 100);
      } else {
        alert('Failed to fetch transactions');
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Sort transactions by date descending and take recent 5
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

//  const handleLogout = () => {
//    logout();
//    setTimeout(() => {
//      navigate('/login');
//    }, 100);
//  };

  return (
    <div>
      <Navbar />
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {user?.name && (
            <p className="text-gray-700 text-sm">
              Welcome back, {user.name.split(' ')[0]} 👋
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        <StatCard
          label="Total Income"
          value={new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(totalIncome)}
          color="bg-green-100"
        />
        <StatCard
          label="Total Expense"
          value={new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(totalExpense)}
          color="bg-red-100"
        />
        <StatCard
          label="Balance"
          value={new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(balance)}
          color="bg-blue-100"
        />
      </div>

      {/* Charts */}
      <div className="my-6 px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Insights</h2>
        <Charts transactions={transactions} />
      </div>

      {/* Recent Transactions */}
      <div className="my-6">
        <h2 className="text-xl font-semibold mb-2">Recent Transactions</h2>
        {recentTransactions.length === 0 ? (
          <p>No recent transactions.</p>
        ) : (
          <ul className="space-y-4">
  {recentTransactions.map((t) => (
    <li key={t._id} className="border p-3 rounded text-sm sm:text-base">
      <div>
        <p className="font-medium">
          <strong>{t.type.toUpperCase()}</strong> –{' '}
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(t.amount)}{' '}
          – {t.category}
        </p>
        <p>{t.description}</p>
        <p className="text-xs text-gray-600 sm:text-sm">
          {new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).format(new Date(t.date))}
        </p>
      </div>
    </li>
  ))}
</ul>
        )}
      </div>
    </div>
    </div>
  );

};

export default Home;
