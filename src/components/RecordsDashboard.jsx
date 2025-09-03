import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { makeAuthenticatedRequest } from '../utils/api';
import '../styles/App.css';

const socket = io('http://localhost:5000/admin', { reconnection: true, reconnectionAttempts: 5 });

const RecordsDashboard = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all submission records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await makeAuthenticatedRequest('http://localhost:5000/api/submissions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }, navigate);
      console.log('API response:', data); // Debug log
      setRecords(Array.isArray(data.submissions) ? data.submissions : []);
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to fetch records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    socket.on('formUpdated', () => {
      fetchRecords();
    });
    return () => {
      socket.off('formUpdated');
    };
  }, []);

  // Handle record deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await makeAuthenticatedRequest(`http://localhost:5000/api/submissions/${id}`, {
          method: 'DELETE',
        }, navigate);
        alert('Record deleted successfully!');
        fetchRecords();
      } catch (error) {
        setError(error.message || 'Failed to delete record.');
      }
    }
  };

  // Handle partner-related changes (currently a no-op, to be refined)
  const handlePartnerChange = useCallback((updatedData) => {
    console.log('Partner data updated:', updatedData);
    // TODO: Implement logic to update state or API if needed
  }, []);

  // Render a single table row
  const renderTableRow = (record) => (
    <tr key={record.id}>
      <td>{record.name}</td>
      <td>{record.firmName}</td>
      <td>{record.sapCode}</td>
      <td>{record.vendorCode}</td>
      <td>{record.noOfTrucks}</td>
      <td>
        <button
          className="apple-button secondary"
          onClick={() => navigate(`/edit/${record.id}`)}
        >
          Edit
        </button>
        <button
          className="apple-button danger"
          onClick={() => handleDelete(record.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Records Dashboard</h2>
      {error && (
        <div className="error" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Firm Name</th>
              <th>SAP Code</th>
              <th>Vendor Code</th>
              <th>No. of Trucks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{records.map(renderTableRow)}</tbody>
        </table>
      )}
    </div>
  );
};

export default RecordsDashboard;