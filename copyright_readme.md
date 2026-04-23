# Project Analysis & Copyright Information
**Project:** MahaNagarSarthi - Digital Grievance Suggestion & Reporting System For PCMC

---

## 1. Tech Stack

The application is built using a modern JavaScript/TypeScript ecosystem for scalable, full-stack web applications (often referred to as the PERN stack, modified with React and Vite).

### **Frontend (Client-Side)**
- **Framework:** React (v19)
- **Build Tool:** Vite (provides fast HMR and optimized production builds)
- **Styling:** Tailwind CSS (v4) & PostCSS
- **Routing:** React Router DOM (v7)
- **Icons & UI:** Lucide React
- **Data Visualization:** Recharts (for analytical dashboards)

### **Backend (Server-Side)**
- **Runtime:** Node.js
- **Web Framework:** Express.js (v5)
- **Authentication:** JWT (JSON Web Tokens) for secure stateless API requests
- **File Uploads:** Multer (memory storage for processing uploads)
- **Cloud Storage:** AWS SDK / Amazon S3 (for storing images related to grievances)
- **Security & Config:** CORS, Dotenv

### **Database (Data Layer)**
- **Database Engine:** PostgreSQL (relational DB)
- **Driver:** `pg` (Node Postgres)

### **Development & Utility**
- **Linting:** ESLint with React hooks plugins
- **Task Runner:** Concurrently (runs both the React frontend and Node backend simultaneously)
- **Monitor:** Nodemon (restarts server on changes)

---

## 2. System Architecture

The application implements a decoupled **Client-Server Architecture**.

### **A. Presentation Tier (Frontend)**
- **Single Page Application (SPA):** React generates UI components dynamically.
- **Role-Based Views:**
  - *Citizen Role:* Access to Landing Page, User Dashboard, Complaint Registration (with photo uploads and map selection), and Complaint Tracking.
  - *Admin Role:* Restricted routes that render the Admin Dashboard (handles status updates, complaint lifecycle, and grievance analytics).
- **Communication:** Uses standard localized API calls (`fetch` layer or `axios`) to communicate with the Backend using Bearer JWT tokens.

### **B. Application / Logic Tier (Backend REST API)**
- **Express Server (`server/index.js`):** Acts as the central traffic controller exposing a RESTful API.
- **Authentication Gateway:** Endpoints for Signup, Login, and OTP-based verification (`/api/signup`, `/api/login`, `/api/send-otp`). Uses `authGuard` middleware for route protection.
- **Controller/Service Pattern:** Divides business logic into modular controllers (e.g., `complaintController.js`) which then interact with the Postgres database.
- **Asset Management:** Intercepts multipart/form-data (via Multer), temporarily stores in-memory, and pushes the buffers to AWS S3. Returns S3 public URLs to be saved in the database.

### **C. Data Tier (Database)**
- **Postgres DB:** Manages relational datasets ensuring strict atomicity.
- **Key Schemas:**
  - `Users:` Stores Citizen/Admin credentials (mobile, passwords, municipal zones, roles).
  - `Complaints:` Stores grievance types, descriptions, coordinates, timestamps, user associations, and S3 media URLs.

---

## 3. Important Copyright & Proprietary Information

When publishing, deploying, or handing over this codebase, the following legal and copyright considerations MUST be included in the official documentation or `LICENSE` file.

### **1. Ownership and Copyright Declaration**
- **Explicit Statement:** Clearly state who holds the copyright.
  *Example:* `Copyright © 2024-2025 [Your Name/Organization] & Pimpri Chinchwad Municipal Corporation (PCMC). All Rights Reserved.`
- **Nature of Software:** Specify if this is a closed-source proprietary application or an open-source project. If proprietary, explicitly state: *"Unauthorized copying of this file, via any medium, is strictly prohibited. Proprietary and confidential."*

### **2. Licensing**
- If open-sourcing, include a standard license (e.g., **MIT**, **Apache 2.0**, or **GPLv3**).
- If deployed for government use, ensure the license terms grant the municipality the correct rights to use, modify, or distribute the software as per your contract.

### **3. Third-Party Attributions**
You must legally give credit to the open-source libraries upon which this system is built. A brief "Open Source Acknowledgements" section should declare the use of:
- React (MIT License)
- Vite (MIT License)
- Tailwind CSS (MIT License)
- Node.js / Express (MIT License)
- PostgreSQL (PostgreSQL License)
- AWS SDK (Apache 2.0 License)

### **4. Data Privacy, PII & Compliance**
- **Data Collection:** Because the system collects Personally Identifiable Information (PII) like mobile numbers, names, and precise geographic locations, there must be a **Privacy Policy** reference.
- **Compliance:** Ensure a disclaimer is present regarding compliance with local data protection laws (e.g., India's Digital Personal Data Protection Act - DPDP). Mention that user passwords and personal data are meant to be hashed/secured.

### **5. "AS-IS" Warranty Disclaimer**
Always include a liability clause protecting the developers.
*Example:* *"This software is provided 'as is', without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability."*
