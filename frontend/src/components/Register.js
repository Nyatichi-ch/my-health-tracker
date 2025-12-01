import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Register = ({ onSuccess }) => {
  const { register: registerUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser({ email, password, name });
      toast.success('Account created');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Register error', err);
      toast.error(err?.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mb-3">
      <div className="mb-2">
        <input type="text" className="form-control" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="mb-2">
        <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="mb-2">
        <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div>
        <button className="btn btn-secondary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
      </div>
    </form>
  );
};

export default Register;
