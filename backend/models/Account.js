const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  accountNo: { type: String, required: true, unique: true },
  holderName: { type: String, required: true },
  balance: { type: Number, default: 0 },
  isKYCVerified: { type: Boolean, default: false }
}, { collection: "UserData" }); 

module.exports = mongoose.model("Account", accountSchema);
