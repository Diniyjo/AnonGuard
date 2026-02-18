import { useState } from 'react'
import { saveReport, fileToBase64 } from './firebase'

function App() {
  const [text, setText] = useState("")
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState("idle")
  
  // New state to remember the correct file name
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [fileName, setFileName] = useState("evidence") 

  const handleUpload = async () => {
    if (!text && !file) return alert("Please enter text or pick a file first.")
    
    setStatus("uploading")
    
    try {
      // 1. Upload to Firebase
      const hash = await saveReport(text, file)
      
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