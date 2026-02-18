import { useState } from 'react'
import { saveReport, fileToBase64 } from './firebase'

function App() {
  const [text, setText] = useState("")
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState("idle")
  //NEW - adding bridge
  const [redactedText, setRedactedText] = useState("") // New state for AI output
  // New state to remember the correct file name
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [fileName, setFileName] = useState("evidence") 

  const handleUpload = async () => {
    if (!text && !file) return alert("Please enter text or pick a file first.")
    
    setStatus("uploading")

    try {
      // --- NEW: AI REDACTION BRIDGE ---
      // This sends the text to your geminiRedaction.py server
      const aiResponse = await fetch('http://127.0.0.1:5000/redact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      });
      
      const aiData = await aiResponse.json();
      const cleanText = aiData.redactedText; 
      setRedactedText(cleanText); 
      // --- END NEW SECTION ---
    
    //try {
      // 1. Upload to Firebase
      //NEW - add cleanText
      const hash = await saveReport(text, cleanText, file)
      
      // 2. Create the download link with the CORRECT name
      if (file) {
        const base64 = await fileToBase64(file)
        setDownloadUrl(base64)
        setFileName(file.name) // <--- This fixes the corrupt file issue
      }

      console.log("Upload Success. Hash:", hash)
      setStatus("done")
      alert("Report Secured.\nBlockchain Hash: " + hash)
      
    } catch (error) {
      console.error(error)
      setStatus("error")
      alert("Upload Failed. Check console.")
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>AnonGuard Backend Test</h1>
      <p>Current Status: <strong>{status.toUpperCase()}</strong></p>
      
      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        <h3>1. Enter Sensitive Info</h3>
        <textarea 
          style={{ width: "100%", height: "100px", padding: "10px" }}
          placeholder="Type report here..."
          onChange={(e) => setText(e.target.value)}
        />
        
        <h3>2. Attach Proof (Optional)</h3>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        
        <br /><br />
        
        <button 
          onClick={handleUpload}
          disabled={status === "uploading"}
          style={{ 
            padding: "15px 30px", 
            fontSize: "16px", 
            backgroundColor: status === "uploading" ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {status === "uploading" ? "Securing..." : "Secure & Submit"}
        </button>
      </div>

      {/* --- NEW: Preview of the AI Redaction --- */}
      {redactedText && (
        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f0f7ff", border: "1px solid #007bff", borderRadius: "5px" }}>
          <h3 style={{ color: "#007bff", marginTop: 0 }}>AI Redacted Result:</h3>
          <p style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>{redactedText}</p>
        </div>
      )}

      {status === "done" && (
        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "5px" }}>
          <h3>Success. Data Secured.</h3>
          <p><strong>Hash ID:</strong> <span style={{fontSize: "12px"}}>{downloadUrl ? "Generated" : "N/A"}</span></p>
          
          {downloadUrl && (
            <div style={{ marginTop: "10px" }}>
              <p><strong>Test Retrieval:</strong></p>
              <a 
                href={downloadUrl} 
                download={fileName} // <--- Uses the real file name now
                style={{ 
                  backgroundColor: "#28a745", color: "white", padding: "10px 15px", 
                  textDecoration: "none", borderRadius: "5px", display: "inline-block" 
                }}
              >
                Download Evidence ({fileName})
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App