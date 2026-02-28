import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import CryptoJS from "crypto-js"; 

// firebase configuration key
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// convert file to base64 string
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
  
    if (!file) resolve(null); 
    
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// hash generation using SHA256
export const generateHash = (text) => {

  return CryptoJS.SHA256(String(text)).toString();
};

// report saving function
export const saveReport = async (originalText, fileObject) => {
  try {
    let fileString = null;
    
    // 1. Convert file if it exists
    if (fileObject) {
      // Safety check for file size (Firestore documents have a 1MB limit)
      if (fileObject.size > 1000000) { 
          throw new Error("File is too large (Max 1MB for Firestore).");
      }
      fileString = await fileToBase64(fileObject);
    }

    // 2. Generate Hash
    // We hash the content to create a unique fingerprint
    const contentToHash = (originalText || "") + (fileString || "");
    const docHash = generateHash(contentToHash);
    
    // 3. Save to Firestore
    // Collection name: "submissions"
    const docRef = await addDoc(collection(db, "submissions"), {
      text_content: originalText,
      file_data: fileString, 
      hash: docHash, 
      timestamp: serverTimestamp(),
      status: "new"
    });
    
    console.log("Firebase Success! Doc ID:", docRef.id);
    return docHash; // Return the hash so the UI can display it
  } catch (e) {
    console.error("Firebase Save Error: ", e);
    throw e; // Pass error back to ProcessingPage to handle
  }
};