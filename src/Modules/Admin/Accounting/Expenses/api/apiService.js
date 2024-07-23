import axios from 'axios';
import { baseUrl } from '../../../../../config/Common';

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    Authentication: `${localStorage.getItem('admin:token')}`
  }
});

export const createExpense = (data) => api.post('/', data);
export const getAllExpenses = () => api.get('/');
export const getExpenseById = (id) => api.get(`/${id}`);
export const updateExpense = (id, data) => api.put(`/${id}`, data);
export const deleteExpense = (id) => api.delete(`/${id}`);
