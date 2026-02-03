
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();




const Account = require("./models/Account");




app.use(cors());
app.use(express.json());



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected to 'bank' database on 27017"))
  .catch(err => console.log("MongoDB connection error:", err));



app.post("/api/accounts", async (req, res) => {
  const { accountNo, holderName, isKYCVerified } = req.body;

  if (!accountNo || !holderName) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const exists = await Account.findOne({ accountNo });
    if (exists) return res.status(400).json({ error: "Account already exists" });

    const account = await Account.create({
      accountNo,
      holderName,
      balance: 0,
      isKYCVerified: !!isKYCVerified
    });

    res.json({ message: "Account created", account });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.get("/api/accounts", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.post("/api/deposit", async (req, res) => {
  const { accountNo, amount } = req.body;

  try {
    const acc = await Account.findOne({ accountNo });
    if (!acc) return res.status(404).json({ error: "Account not found" });
    if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    acc.balance += Number(amount);
    await acc.save();

    res.json({ message: "Deposit successful", balance: acc.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.post("/api/withdraw", async (req, res) => {
  const { accountNo, amount } = req.body;

  try {
    const acc = await Account.findOne({ accountNo });
    if (!acc) return res.status(404).json({ error: "Account not found" });
    if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });
    if (acc.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

    acc.balance -= Number(amount);
    await acc.save();

    res.json({ message: "Withdraw successful", balance: acc.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/api/transfer", async (req, res) => {
  const { senderAccount, receiverAccount, amount } = req.body;

  try {
    const sender = await Account.findOne({ accountNo: senderAccount });
    const receiver = await Account.findOne({ accountNo: receiverAccount });

    if (!sender || !receiver) return res.status(404).json({ error: "Sender or Receiver not found" });
    if (!sender.isKYCVerified) return res.status(400).json({ error: "Sender KYC not verified" });
    if (sender.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

    sender.balance -= Number(amount);
    receiver.balance += Number(amount);

    await sender.save();
    await receiver.save();

    res.json({ message: "Transfer successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
