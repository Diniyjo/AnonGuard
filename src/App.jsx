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

  // THIS WAS MISSING! 
  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setStep('PROCESSING');
  };

  const handleProcessComplete = (hash, base64, name) => {
    setFinalHash(hash);
    setFileData(base64); 
    setFileName(name);   
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
          fileData={fileData}  // Added this
          fileName={fileName}  // Added this
          onReset={() => setStep('LANDING')} 
        />
      )}
    </div>
  );
}

export default App;
