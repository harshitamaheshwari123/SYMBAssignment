const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let accounts = [];

// ========== CREATE ACCOUNT ==========
app.post("/api/accounts", (req, res) => {
  const { accountNo, holderName, isKYCVerified } = req.body;

  if (!accountNo || !holderName) {
    return res.status(400).json({ error: "All fields required" });
  }

  const exists = accounts.find(a => a.accountNo === accountNo);
  if (exists) {
    return res.status(400).json({ error: "Account already exists" });
  }

  const newAccount = {
    accountNo,
    holderName,
    balance: 0,
    isKYCVerified: !!isKYCVerified
  };

  accounts.push(newAccount);
  res.json({ message: "Account created", account: newAccount });
});

// ========== GET ALL ACCOUNTS ==========
app.get("/api/accounts", (req, res) => {
  res.json(accounts);
});

// ========== DEPOSIT ==========
app.post("/api/deposit", (req, res) => {
  const { accountNo, amount } = req.body;
  const acc = accounts.find(a => a.accountNo === accountNo);

  if (!acc) return res.status(404).json({ error: "Account not found" });
  if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  acc.balance += Number(amount);
  res.json({ message: "Deposit successful", balance: acc.balance });
});

// ========== WITHDRAW ==========
app.post("/api/withdraw", (req, res) => {
  const { accountNo, amount } = req.body;
  const acc = accounts.find(a => a.accountNo === accountNo);

  if (!acc) return res.status(404).json({ error: "Account not found" });
  if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  if (acc.balance < amount) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  acc.balance -= Number(amount);
  res.json({ message: "Withdraw successful", balance: acc.balance });
});

// ========== TRANSFER ==========
app.post("/api/transfer", (req, res) => {
  const { senderAccount, receiverAccount, amount } = req.body;

  const sender = accounts.find(a => a.accountNo === senderAccount);
  const receiver = accounts.find(a => a.accountNo === receiverAccount);

  if (!sender || !receiver) {
    return res.status(404).json({ error: "Sender or Receiver not found" });
  }

  // Mandatory Validations
  if (!sender.isKYCVerified) {
    return res.status(400).json({ error: "Sender KYC not verified" });
  }

  if (sender.balance < amount) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  sender.balance -= Number(amount);
  receiver.balance += Number(amount);

  res.json({ message: "Transfer successful" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
