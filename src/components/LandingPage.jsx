import React, { useRef } from 'react';
import '../styles/LandingPage.css';

function LandingPage({ onUpload }) {
  // This creates a reference to a hidden file input
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file); // Sends file to App.jsx
    }
  };

  return (
    <div className="view-container">
      <div className="hero">
        <span className="badge">ANONYMOUS_SESSION_INITIALIZED</span>
        <h1>Secure Anonymous Reporting</h1>
        <p>Analyze and redact PII from documents instantly using Gemini 1.5. No logs. No traces.</p>
      </div>

      {/* Clicking this div now triggers the file selector */}
      <div className="upload-area" onClick={handleButtonClick}>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
        <div className="upload-icon">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <button className="btn-primary">Choose File</button>
        <p>or click to browse PDF, DOCX, or Image</p>
        <div className="security-footer">
          <span>✔️ No Logs</span> <span>✔️ PII Redaction</span> <span>✔️ SHA-256 Integrity</span>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;