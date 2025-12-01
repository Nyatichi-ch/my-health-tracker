import axios from 'axios';

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
	withCredentials: true,
});

export const fetchEntries = () => api.get('/entries');
export const postEntry = (data) => api.post('/entries', data);

// Auth helpers
export const register = (payload) => api.post('/auth/register', payload);
export const login = (payload) => api.post('/auth/login', payload);
export const logout = () => api.post('/auth/logout');
export const me = () => api.get('/auth/me');
