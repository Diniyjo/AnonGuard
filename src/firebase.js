// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import SHA256 from "crypto-js/sha256"; 

// firebase configuration key
const firebaseConfig = {
  apiKey: "AIzaSyCOnY4dOCrU1y6Pk_dHF6Prf9cXrodNA2M",
  authDomain: "anon-guard2026.firebaseapp.com",
  projectId: "anon-guard2026",
  storageBucket: "anon-guard2026.firebasestorage.app",
  messagingSenderId: "755657871658",
  appId: "1:755657871658:web:6c04aa48f0c8dcf1d78e53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// convert file to base64 string (for storage in Firestore)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// hash generation using SHA256 from crypto-js
export const generateHash = (text) => {
  return SHA256(text).toString();
};

// report saving function
// Diniy call this function when user submits a report. It takes the text and file, generates a hash, and saves everything to Firestore.
export const saveReport = async (originalText, fileObject) => {
  try {
    let fileString = null;
    
    // Convert file if it exists
    if (fileObject) {
      if (fileObject.size > 1000000) { // Limit to 1MB to prevent crashing
         alert("File is too big for this Demo! Keep it under 1MB.");
         return null;
      }
      fileString = await fileToBase64(fileObject);
    }

    // hashinng here
    // Hash the text + the file data so ANY change changes the hash
    const contentToHash = originalText + (fileString || "");
    const docHash = generateHash(contentToHash);
    
    // Save to Database
    await addDoc(collection(db, "submissions"), {
      text_content: originalText,
      file_data: fileString, // <--- Your file is saved here as a text string!
      hash: docHash, 
      timestamp: serverTimestamp(),
      status: "new"
    });
    
    console.log("Success! Hash ID:", docHash);
    return docHash;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};