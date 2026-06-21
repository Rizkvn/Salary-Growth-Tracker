import React, { useState, useEffect } from 'react';
import { getPromotions, createPromotion, deletePromotion } from '../services/promotionService';
import './PromotionPage.css';

const PromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [title, setTitle] = useState('');
  const [promotionDate, setPromotionDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [validationErrors, setValidationErrors] = useState({});

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setListError(false);
      const data = await getPromotions();
      setPromotions(data);
    } catch (err) {
      setListError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    if (!title || !title.trim()) {
      errors.title = 'Title is required.';
    }
    
    if (!promotionDate) {
      errors.promotionDate = 'Promotion date is required.';
    }

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setCreating(true);
      setCreateError(false);
      await createPromotion({
        title: title.trim(),
        promotion_date: promotionDate,
        notes: notes.trim() || null
      });
      setTitle('');
      setPromotionDate('');
      setNotes('');
      setValidationErrors({});
      await fetchPromotions();
    } catch (err) {
      setCreateError(true);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotion record?')) {
      return;
    }

    try {
      setDeletingId(id);
      setDeleteError(false);
      await deletePromotion(id);
      await fetchPromotions();
    } catch (err) {
      setDeleteError(true);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="promotion-page-container">
      <h2 className="promotion-page-title">Promotion Tracking</h2>
      
      {listError && <div className="list-error">Failed to load promotion data.</div>}
      
      <div className="section">
        <h3 className="section-title">Create Promotion</h3>
        {createError && <div className="api-error">Failed to create promotion.</div>}
        <form className="create-promotion-form" onSubmit={handleCreate}>
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input 
              type="text" 
              id="title" 
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={creating}
              placeholder="e.g. Senior Engineer"
            />
            {validationErrors.title && <div className="validation-error">{validationErrors.title}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="promotionDate">Promotion Date</label>
            <input 
              type="date" 
              id="promotionDate" 
              className="form-control"
              value={promotionDate}
              onChange={(e) => setPromotionDate(e.target.value)}
              disabled={creating}
            />
            {validationErrors.promotionDate && <div className="validation-error">{validationErrors.promotionDate}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <input 
              type="text" 
              id="notes" 
              className="form-control"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={creating}
            />
          </div>
          <button 
            type="submit" 
            className="btn-add"
            disabled={creating}
          >
            {creating ? 'Adding...' : 'Add Promotion'}
          </button>
        </form>
      </div>

      <div className="section">
        <h3 className="section-title">Promotion History</h3>
        {deleteError && <div className="api-error">Failed to delete promotion.</div>}
        
        {loading ? (
          <div className="loading-text">Loading promotion data...</div>
        ) : (
          <table className="promotion-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>TITLE</th>
                <th>PROMOTION DATE</th>
                <th>NOTES</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => (
                <tr key={promotion.id}>
                  <td>{promotion.id}</td>
                  <td>{promotion.title}</td>
                  <td>{promotion.promotion_date}</td>
                  <td>{promotion.notes || "-"}</td>
                  <td>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(promotion.id)}
                      disabled={deletingId === promotion.id}
                    >
                      {deletingId === promotion.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
              {promotions.length === 0 && !listError && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No promotion records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PromotionPage;
