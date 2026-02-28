import React from 'react';
import '../styles/ResultPage.css';

function ResultPage({ hash, fileData, fileName, redactedCount, onReset }) {
  
  const handleDownload = () => {
    if (!fileData) return alert("No file data found!");

    const link = document.createElement('a');
    link.href = fileData; 
    
    // File Naming
    const downloadName = fileName 
      ? `REDACTED_${fileName}` 
      : "REDACTED_Anonymous_Report.txt";
    
    link.download = downloadName; 
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="view-container">
      <div className="hero">
        <span className="badge success">REPORT_SECURED</span>
        <h1>Report Submitted Successfully</h1>
        <p>Your document has been analyzed, redacted, and submitted anonymously.</p>
      </div>

      <div className="summary-card">
        <div className="card-header">REPORT SUMMARY</div>
        <div className="file-info">
          <span>📄 {fileName || 'report_document.txt'}</span>
          <span className="redacted-tag">REDACTED</span>
        </div>
        
        <div className="pii-list">
          <div className="pii-item">
            <span>IC Number</span>
            <span className="masked">******-**-****</span>
          </div>
          <div className="pii-item">
            <span>Passport Number</span>
            <span className="masked">A*******</span>
          </div>
          <div className="pii-item">
            <span>Phone Number</span>
            <span className="masked">+60-**-***-****</span>
          </div>
        </div>
        {/*  Using count from Python/Firebase backend */}
        <div className="total-count">TOTAL REDACTED: {redactedCount || 0} entities</div>
      </div>

      <div className="summary-card">
        <div className="card-header">INTEGRITY VERIFICATION</div>
        <div className="hash-box">
          <label>SHA-256 FINGERPRINT</label>
          <code>{hash || "Processing..."}</code>
        </div>
      </div>

      <button className="btn-primary" onClick={handleDownload}>
        Download Redacted Copy
      </button>
      
      <button className="btn-secondary" onClick={onReset} style={{marginTop: '10px'}}>
        Submit Another Report
      </button>
    </div>
  );
}

export default ResultPage;