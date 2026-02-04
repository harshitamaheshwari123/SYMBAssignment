Online Bank Mini System

This is a full-stack Online Bank Mini System developed as part of an assignment.  
The application supports account creation and basic banking transactions with proper validation logic.

  


Tech Stack  
Frontend: React.js  
Backend: Node.js, Express.js  
Deployment: Vercel / Netlify (Frontend), Render (Backend)  

Features  
- Create bank account  
- Deposit money  
- Withdraw money  
- Transfer money between accounts  
- Account listing screen  
- Output display for success and error messages  

Transfer Validations  
- Sender must be KYC verified  
- Sender must have sufficient balance  
- Error message shown if validation fails  

UI Screens  
- Account creation screen  
- Deposit screen  
- Withdraw screen  
- Transfer screen  
- Account listing screen  
- Output display pane  

API Endpoints  
POST /api/accounts  
GET /api/accounts  
POST /api/deposit  
POST /api/withdraw  
POST /api/transfer  

How to Run Locally  

Backend  
cd backend  
npm install  
npm start  

Frontend  
cd frontend  
npm install  
npm start  

  

Notes  
- This project uses in-memory storage.  
- Restarting backend will reset all data.  
- Account numbers must match exactly for transfers.  
