import React, { useEffect, useState } from 'react';
import { saveReport, fileToBase64 } from '../firebase'; //
import '../styles/ProcessingPage.css';

function ProcessingPage({ file, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [generatedHash, setGeneratedHash] = useState("");
  const [base64Data, setBase64Data] = useState("");

  useEffect(() => {
    const doUpload = async () => {
      try {
        //
        const hash = await saveReport("Anonymous AI-Redacted Report", file);
        const base64 = await fileToBase64(file);
        
        if (hash) {
          setGeneratedHash(hash);
          setBase64Data(base64);
        }
      } catch (err) {
        console.error("Upload Error:", err);
      }
    };

    if (file) {
      doUpload();
    }

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(oldProgress + 5, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, [file]);

  useEffect(() => {
    if (progress === 100 && generatedHash && base64Data) {
      // Sending back to App.jsx: hash, file content, and file name
      setTimeout(() => onComplete(generatedHash, base64Data, file.name), 1000);
    }
  }, [progress, generatedHash, base64Data, onComplete, file]);

  return (
    <div className="view-container">
      <div className="hero">
        <h1>Analyzing Document</h1>
        <p>AI-powered scan in progress. Do not close this window.</p>
      </div>

      <div className="processing-visual">
        <div className="document-container">
          <div className="document-glass">
            <div className="scan-laser"></div>
            <div className="doc-content">
              {[...Array(11)].map((_, i) => (
                <div key={i} className={`doc-line ${i === 0 ? 'header' : 'long'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="session-log">
        <div className="log-header">
           <span className="dot red"></span>
           <span className="dot yellow"></span>
           <span className="dot green"></span>
           ANONGUARD-AI-SCANNER -- SESSION_LOG
        </div>
        <div className="log-body">
          <p><span className="log-init">[INIT]</span> Establishing secure tunnel...</p>
          <p><span className="log-init">[INIT]</span> Secure tunnel established. AES-256-GCM active.</p>
          <p><span className="log-scan">[SCAN]</span> Loading document into ephemeral sandbox...</p>
          <p><span className="log-ai">[AI]</span> Gemini 1.5 Pro initialized.</p>
          {progress > 50 && <p><span className="log-scan">[HASH]</span> Generating SHA-256 Integrity...</p>}
          <p className="cursor">█</p>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-info">
          <span>SCAN_PROGRESS</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default ProcessingPage;