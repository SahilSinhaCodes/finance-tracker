import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

// Color palette for pie chart categories
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57', '#8dd1e1'];

const Charts = ({ transactions }) => {
  // -------- PIE CHART: Category-wise Expense Breakdown --------
  const pieData = useMemo(() => {
    const categoryTotals = {};

    transactions.forEach((t) => {
      if (t.type === 'expense') {
        if (!categoryTotals[t.category]) {
          categoryTotals[t.category] = 0;
        }
        categoryTotals[t.category] += Number(t.amount);
      }
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  }, [transactions]);

  // -------- BAR CHART: Monthly Trends for Income & Expense --------
  const barData = useMemo(() => {
    const monthlyData = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., "May 2025"

      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        monthlyData[month].income += Number(t.amount);
      } else if (t.type === 'expense') {
        monthlyData[month].expense += Number(t.amount);
      }
    });

    return Object.values(monthlyData).sort((a, b) => new Date('1 ' + a.month) - new Date('1 ' + b.month));
  }, [transactions]);

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-8">
      {/* -------- PIE CHART -------- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-700 tracking-wide mb-4">
          🧾 Expenses by Category
        </h2>
        {pieData.length === 0 ? (
          <p>No expenses to display</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* -------- BAR CHART -------- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-700 tracking-wide mb-4">
          📈 Monthly Income vs Expense
        </h2>
        
        {barData.length === 0 ? (
          <p>No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#82ca9d" />
              <Bar dataKey="expense" fill="#ff7f50" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Charts;