import axios from 'axios';

            
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/entries';


export const fetchEntries = () => axios.get(API_URL);
export const postEntry = (data) => axios.post(API_URL, data);
