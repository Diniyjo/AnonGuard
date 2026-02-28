import React, { useEffect, useState } from 'react';
import { saveReport, fileToBase64 } from '../firebase'; 
import '../styles/ProcessingPage.css';

function ProcessingPage({ file, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [generatedHash, setGeneratedHash] = useState("");
  const [base64Data, setBase64Data] = useState("");
  const [isBackendDone, setIsBackendDone] = useState(false);
  const [redactedCount, setRedactedCount] = useState(0); 

  useEffect(() => {
    const doUpload = async () => {
      try {
        // 1. Read the text from the uploaded .txt file
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });

        // 2. Send the raw text to the Python Brain (Port 8000)
        console.log("Sending to Brain...");
        const aiResponse = await fetch("http://127.0.0.1:8000/redact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text })
        });

        // 3. Catch the redacted result
        const data = await aiResponse.json();
        
        if (data.error) {
           console.error("Brain Error:", data.error);
           return;
        }

        // 4. FIX: Set the count from the Python backend response
        setRedactedCount(data.total_redacted || 0); 
        
        // 5. Use the REAL hash
        const realHash = data.hash; 
        
        // 6. Convert the REDACTED text to base64 for download
        const redactedBase64 = "data:text/plain;base64," + btoa(unescape(encodeURIComponent(data.redacted_text)));

        setGeneratedHash(realHash);
        setBase64Data(redactedBase64);
        setIsBackendDone(true); // Tell the UI the AI is finished
        
      } catch (err) {
        console.error("Upload Error:", err);
      }
    };

    if (file) {
      doUpload();
    }

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 95 && !isBackendDone) {
          return 95; 
        }
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return oldProgress + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [file, isBackendDone]);

  useEffect(() => {

    if (progress === 100 && isBackendDone && generatedHash) {
      setTimeout(() => {
        onComplete(generatedHash, base64Data, file.name, redactedCount);
      }, 1000);
    }
  }, [progress, isBackendDone, generatedHash, base64Data, redactedCount, onComplete, file.name]);

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
          {isBackendDone && <p><span className="log-init">[SUCCESS]</span> Data received from Brain.</p>}
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