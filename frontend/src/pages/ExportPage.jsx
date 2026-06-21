import React, { useState, useEffect } from 'react';
import { downloadCombinedReport } from '../services/exportService';
import './ExportPage.css';

const ExportPage = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let timeoutId;
    if (success) {
      timeoutId = setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [success]);

  const handleExport = async (typeLabel) => {
    try {
      setIsExporting(true);
      setError(null);
      setSuccess(null);
      
      await downloadCombinedReport();
      
      setSuccess(`${typeLabel} exported successfully.`);
    } catch (err) {
      setError(`Failed to export ${typeLabel.toLowerCase()}.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-page-container">
      <h2 className="export-page-title">Data Export</h2>
      
      {error && <div className="export-banner-error">{error}</div>}
      {success && <div className="export-banner-success">{success}</div>}
      
      <div className="export-notice">
        <strong>Note:</strong> For the Sprint 3E MVP, all export options currently download the complete combined report containing both Salary and Promotion histories.
      </div>
      
      <div className="export-cards-grid">
        <div className="export-card">
          <h3 className="export-card-title">Salary History</h3>
          <p className="export-card-desc">Download salary history records.</p>
          <button 
            className="export-btn"
            onClick={() => handleExport('Salaries')}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Salaries'}
          </button>
        </div>
        
        <div className="export-card">
          <h3 className="export-card-title">Promotion History</h3>
          <p className="export-card-desc">Download promotion history records.</p>
          <button 
            className="export-btn"
            onClick={() => handleExport('Promotions')}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Promotions'}
          </button>
        </div>
        
        <div className="export-card">
          <h3 className="export-card-title">Complete Backup</h3>
          <p className="export-card-desc">Download full Salary Growth Tracker export.</p>
          <button 
            className="export-btn"
            onClick={() => handleExport('Full Report')}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Full Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
