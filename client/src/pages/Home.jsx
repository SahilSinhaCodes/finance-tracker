import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Charts from '../components/Charts';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar.jsx';

const Home = () => {
  const { token, logout, user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('https://finance-tracker-api-uhav.onrender.com/api/transactions', {
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

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-1">
              Dashboard
            </h1>
            {user?.name && (
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                Welcome <span className="text-blue-600">{user.name.split(' ')[0]}</span>! 👋
              </p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
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
        <div className="my-8 px-2 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-700 mb-4 tracking-wide">
            📊 Insights Overview
          </h2>
          <Charts transactions={transactions} />
        </div>

        {/* Recent Transactions */}
        <div className="my-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 tracking-wide">
            💰 Recent Transactions
          </h2>
          {recentTransactions.length === 0 ? (
            <p>No recent transactions.</p>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTransactions.map((t) => (
                <li
                  key={t._id}
                  className={`rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition ${
                    t.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                      {t.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Intl.DateTimeFormat('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }).format(new Date(t.date))}
                    </span>
                  </div>
                  <p className="text-base font-medium text-gray-800">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    }).format(t.amount)}
                  </p>
                  <p className="text-sm text-gray-600 italic">{t.category}</p>
                  {t.description && (
                    <p className="text-sm text-gray-700 mt-1">{t.description}</p>
                  )}
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
