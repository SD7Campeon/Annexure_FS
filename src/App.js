// C:\Users\hp\Downloads\annexure\frontend\src\App.js
import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import CombinedForm from './components/CombinedForm';
import EditForm from './components/EditForm';
import RecordsDashboard from './components/RecordsDashboard';
import Login from './components/Login';
import './styles/App.css';

const AppContent = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  // Define handlePartnerChange at App level (optional, can be moved to RecordsDashboard if needed)
  const handlePartnerChange = useCallback((updatedData) => {
    console.log('Partner data updated at App level:', updatedData);
    // TODO: Implement global state update or API call if needed
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-container">
          <Link to="/" className="logo-link" aria-label="Home">
            <svg className="app-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 1C8.1 1 5 4.1 5 8c0 2.6 1.4 4.9 3.6 6.1-.2.6-.8 1.9-2.1 3.4C4.5 19.8 3 21 3 21s2.2-.6 3.5-1.5c1.2-.9 2.2-2.1 2.6-3.1C10.6 17.4 12 18 14 18c3.9 0 7-3.1 7-7s-3.1-7-7-7zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
            </svg>
          </Link>
          <button
            className="nav-toggle"
            onClick={toggleNav}
            aria-expanded={isNavOpen}
            aria-controls="nav-menu"
            aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <svg className="hamburger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isNavOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <nav className={`app-nav ${isNavOpen ? 'open' : ''}`} id="nav-menu">
            <Link to="/" className="nav-link" onClick={() => setIsNavOpen(false)}>Home</Link>
            <Link to="/admin" className="nav-link" onClick={() => setIsNavOpen(false)}>Admin</Link>
            <Link to="/form" className="nav-link" onClick={() => setIsNavOpen(false)}>Create Form</Link>
            <button
              className="nav-link"
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
                setIsNavOpen(false);
              }}
            >
              Logout
            </button>
          </nav>
          <div className="header-actions">
            <button className="search-button" aria-label="Search">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <div className="hero-container">
                <h1 className="hero-title animate-fade-in">Unified ANNEXURE Form Generator</h1>
                <p className="hero-subtitle animate-fade-in-delay">Streamline your ANNEXURE submissions with ease.</p>
                <div className="hero-buttons animate-fade-in-delay-2">
                  <Link to="/admin" className="apple-button primary">Admin Dashboard</Link>
                  <Link to="/form" className="apple-button secondary">Create New Form</Link>
                </div>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><RecordsDashboard /></ProtectedRoute>} />
          <Route path="/form" element={<ProtectedRoute><CombinedForm /></ProtectedRoute>} />
          <Route
            path="/edit/:id"
            element={<ProtectedRoute><EditForm /></ProtectedRoute>}
          />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;