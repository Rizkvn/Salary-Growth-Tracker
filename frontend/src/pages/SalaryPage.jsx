import React, { useState, useEffect } from 'react';
import { getSalaries, createSalary, deleteSalary } from '../services/salaryService';
import { formatCurrency } from '../utils/formatCurrency';
import './SalaryPage.css';

const SalaryPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [salaryAmount, setSalaryAmount] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  
  const [validationErrors, setValidationErrors] = useState({});

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      setListError(false);
      const data = await getSalaries();
      setSalaries(data);
    } catch (err) {
      setListError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    if (!salaryAmount) {
      errors.salaryAmount = 'Salary amount is required.';
    } else if (Number(salaryAmount) <= 0) {
      errors.salaryAmount = 'Salary amount must be greater than 0.';
    }
    
    if (!effectiveDate) {
      errors.effectiveDate = 'Effective date is required.';
    }

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setCreating(true);
      setCreateError(false);
      await createSalary({
        amount: Number(salaryAmount),
        effective_date: effectiveDate
      });
      setSalaryAmount('');
      setEffectiveDate('');
      setValidationErrors({});
      await fetchSalaries();
    } catch (err) {
      setCreateError(true);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this salary record?')) {
      return;
    }

    try {
      setDeletingId(id);
      setDeleteError(false);
      await deleteSalary(id);
      await fetchSalaries();
    } catch (err) {
      setDeleteError(true);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="salary-page-container">
      <h2 className="salary-page-title">Salary Management</h2>
      
      {listError && <div className="list-error">Failed to load salary data.</div>}
      
      <div className="section">
        <h3 className="section-title">Create Salary</h3>
        {createError && <div className="api-error">Failed to create salary.</div>}
        <form className="create-salary-form" onSubmit={handleCreate}>
          <div className="form-group">
            <label htmlFor="salaryAmount">Salary Amount</label>
            <input 
              type="number" 
              id="salaryAmount" 
              className="form-control"
              value={salaryAmount}
              onChange={(e) => setSalaryAmount(e.target.value)}
              disabled={creating}
            />
            {validationErrors.salaryAmount && <div className="validation-error">{validationErrors.salaryAmount}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="effectiveDate">Effective Date</label>
            <input 
              type="date" 
              id="effectiveDate" 
              className="form-control"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              disabled={creating}
            />
            {validationErrors.effectiveDate && <div className="validation-error">{validationErrors.effectiveDate}</div>}
          </div>
          <button 
            type="submit" 
            className="btn-add"
            disabled={creating}
          >
            {creating ? 'Adding...' : 'Add Salary'}
          </button>
        </form>
      </div>

      <div className="section">
        <h3 className="section-title">Salary History</h3>
        {deleteError && <div className="api-error">Failed to delete salary.</div>}
        
        {loading ? (
          <div className="loading-text">Loading salaries...</div>
        ) : (
          <table className="salary-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Salary</th>
                <th>Effective Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((salary) => (
                <tr key={salary.id}>
                  <td>{salary.id}</td>
                  <td>{formatCurrency(salary.amount)}</td>
                  <td>{salary.effective_date}</td>
                  <td>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(salary.id)}
                      disabled={deletingId === salary.id}
                    >
                      {deletingId === salary.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
              {salaries.length === 0 && !listError && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No salary records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalaryPage;
