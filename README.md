# AnonGuard
### AI-Powered Privacy & Identity Redaction Engine
**Developed by Group: WeTried**

AnonGuard is a high-performance data privacy tool designed to secure sensitive communications. By leveraging advanced AI, AnonGuard automatically identifies and masks Personal Identifiable Information (PII), allowing organizations to share critical information while maintaining total participant anonymity and data integrity.

---

## Key Features

- **Context-Aware Redaction:** Powered by **Gemini 1.5 Pro** to intelligently differentiate between names, roles, and entities based on the deep context of the document.
- **Granular Identity Masking:** Specifically categorizes and counts unique identifiers—such as Names, IC/Passport numbers, and Contact Details—ensuring no sensitive data is leaked.
- **Cryptographic Integrity:** Every document is assigned a unique **SHA-256 Fingerprint**, providing a tamper-proof audit trail for the processed data.
- **Zero-Storage Privacy:** Processed reports are handled ephemerally and converted to Base64 for secure, local downloads without storing raw sensitive data on the server.
- **Audit-Ready Reporting:** Logs metadata and verification hashes to **Firebase Firestore**, facilitating secure institutional transparency.

---

## Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), CSS3 (Cyber-Grid UI) |
| **Backend** | Python (FastAPI), Uvicorn |
| **AI Engine** | Gemini 1.5 Pro (Google AI SDK) |
| **Security** | SHA-256 Hashing (CryptoJS & Hashlib) |
| **Database** | Firebase Firestore |

---

## How It Works

1. **Document Ingestion:** Users upload text-based reports or documents requiring anonymization.
2. **Digital Fingerprinting:** The system generates a pre-processing SHA-256 hash to verify the original file's authenticity.

3. **AI Transformation:** The backend engine uses **Gemini 1.5** to scan the text and replace PII with standardized, secure tags like `[NAME]`, `[IC_NUMBER]`, and `[PHONE]`.
4. **Data Auditing:** Python-based logic parses the output to provide a real-time summary of the protection layers applied (e.g., "5 Identifiers Secured").
5. **Secure Delivery:** The final anonymized document is generated for the user along with a verification certificate.

---

## Setup & Installation

### 1. Prerequisites
- Node.js & npm
- Python 3.10+
- Google Gemini API Key

## Mission & Compliance
AnonGuard supports **SDG 16 (Peace, Justice, and Strong Institutions)**  fostering inclusive, transparent, and secure information sharing. We believe that privacy is a fundamental right, and our tool ensures that information can flow freely without compromising individual safety.

---
##  The Team: WeTried
We are a team of passionate developers participating in **KitaHack 2026**.

- DINIY BINTI JOHAN
- NUR DAYANA BINTI RAMLAN
- NUR ANNISA ZULAIKHA BINTI NOR AZMI
- FARAH SYAMIMI BINTI KHARUDDIN

---
<p align="center">
  <b> WeTried</b> | KitaHack 2026
</p>