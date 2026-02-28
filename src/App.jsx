import React, { useState } from 'react';
import LandingPage from './components/LandingPage.jsx';
import ProcessingPage from './components/ProcessingPage.jsx';
import ResultPage from './components/ResultPage.jsx';
import './styles/Global.css';
import './styles/Button.css';

function App() {
  const [step, setStep] = useState('LANDING');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [finalHash, setFinalHash] = useState("");
  const [fileData, setFileData] = useState(null); 
  const [fileName, setFileName] = useState("");
  const [redactedCount, setRedactedCount] = useState(0);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setStep('PROCESSING');
  };

 
  const handleProcessComplete = (hash, base64, name, count) => {
    setFinalHash(hash);
    setFileData(base64); 
    setFileName(name);   
    setRedactedCount(count); 
    setStep('RESULT');
  };

  return (
    <div className="app-dark">
      {step === 'LANDING' && (
        <LandingPage onUpload={handleFileSelect} />
      )}

      {step === 'PROCESSING' && (
        <ProcessingPage 
          file={uploadedFile} 
          onComplete={handleProcessComplete} 
        />
      )}

      {step === 'RESULT' && (
        <ResultPage 
          hash={finalHash} 
          fileData={fileData} 
          fileName={fileName} 
          redactedCount={redactedCount} 
          onReset={() => setStep('LANDING')} 
        />
      )}
    </div>
  );
}

export default App;