import React from 'react';

const TransactionFilters = ({
  filterType,
  filterCategory,
  filterDate,
  setFilterType,
  setFilterCategory,
  setFilterDate,
}) => {
  return (
    <div className="mt-6 mb-4 flex flex-wrap gap-4">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="text"
        placeholder="Filter by Category"
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="border p-2 rounded"
      />
    </div>
  );
};

export default TransactionFilters;
