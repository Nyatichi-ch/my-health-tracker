import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ... inside render
<ToastContainer position="top-right" autoClose={3001} />


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
</>

);
