import React, { useState, useEffect } from 'react';
import LogForm from './components/LogForm';
import RecentEntriesTable from './components/RecentEntriesTable';
import ChartsPanel from './components/ChartsPanel';
import { fetchEntries } from './services/api';
import {ClipLoader} from 'react-spinners'; // assume spinner lib
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [filterDays, setFilterDays] = useState(7);
  const { user, loading: authLoading } = useAuth();

  const loadEntries = async () => {
    setLoadError('');
    setLoadingEntries(true);
    try {
      const res = await fetchEntries();
      setEntries(res.data);
    } catch (err) {
      console.error('Load entries error:', err);
      setLoadError('Failed to load entries. Please try again later.');
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    // only load entries after auth has resolved and a user exists
    if (authLoading) return;
    if (!user) {
      setEntries([]);
      return;
    }
    loadEntries();
  }, [authLoading, user]);

  const filteredEntries = entries.filter(e => {
    const entryDate = new Date(e.createdAt);
    const cutoff = new Date(Date.now() - filterDays * 24 * 60 * 60 * 1000);
    return entryDate >= cutoff;
  });

  return (
    <AuthProvider>
    <div className="container my-4">
      <Header />
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Log Today</h5>
              <LogForm onNewEntry={loadEntries} />
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h6 className="card-title">Recent Entries</h6>
              <div className="table-responsive">
                {loadingEntries ? (
                  <div className="py-4 text-center"><ClipLoader size={35} /></div>
                ) : loadError ? (
                  <div className="text-danger">{loadError}</div>
                ) : (
                  <RecentEntriesTable entries={filteredEntries} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="mb-3">
            <label>Show last&nbsp;
              <select value={filterDays} onChange={e => setFilterDays(Number(e.target.value))}>
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
              </select>
            &nbsp;of data</label>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              {loadingEntries ? (
                <div className="py-4 text-center"><ClipLoader size={35} /></div>
              ) : loadError ? (
                <div className="text-danger">Cannot display charts due to error.</div>
              ) : (
                <ChartsPanel entries={filteredEntries} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthProvider>
  );
}

export default App;

function Header() {
  const { user, logout } = useAuth();
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3>My Health Tracker</h3>
      <div>
        {user ? (
          <div className="d-flex align-items-center">
            <span className="me-3">Signed in as <strong>{user.name || user.email}</strong></span>
            <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Login />
            <Register />
          </div>
        )}
      </div>
    </div>
  );
}
