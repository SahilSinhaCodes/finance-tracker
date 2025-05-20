import API from '../utils/api';

export const addTransaction = (data) => API.post('/transactions', data);
export const getTransactions = () => API.get('/transactions');
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
