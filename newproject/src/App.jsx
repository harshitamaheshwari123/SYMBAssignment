import React, { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api"; 

function App() {
  const [accounts, setAccounts] = useState([]);
  const [msg, setMsg] = useState("");

  const [create, setCreate] = useState({ accountNo: "", holderName: "", isKYCVerified: false });
  const [deposit, setDeposit] = useState({ accountNo: "", amount: "" });
  const [withdraw, setWithdraw] = useState({ accountNo: "", amount: "" });
  const [transfer, setTransfer] = useState({ senderAccount: "", receiverAccount: "", amount: "" });

  const loadAccounts = async () => {
    const res = await fetch(`${API}/accounts`);
    const data = await res.json();
    setAccounts(data);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handle = async (url, body) => {
    try {
      const res = await fetch(`${API}/${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg("✅ " + data.message);
      loadAccounts();
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Online Bank Mini System</h1>

      <div className="box">
        <h2>Create Account</h2>
        <input placeholder="Account No" onChange={e => setCreate({...create, accountNo: e.target.value})}/>
        <input placeholder="Holder Name" onChange={e => setCreate({...create, holderName: e.target.value})}/>
        <label>
          <input type="checkbox" onChange={e => setCreate({...create, isKYCVerified: e.target.checked})}/>
          KYC Verified
        </label>
        <button onClick={() => handle("accounts", create)}>Create</button>
      </div>

      <div className="box">
        <h2>Deposit</h2>
        <input placeholder="Account No" onChange={e => setDeposit({...deposit, accountNo: e.target.value})}/>
        <input placeholder="Amount" onChange={e => setDeposit({...deposit, amount: e.target.value})}/>
        <button onClick={() => handle("deposit", deposit)}>Deposit</button>
      </div>

      <div className="box">
        <h2>Withdraw</h2>
        <input placeholder="Account No" onChange={e => setWithdraw({...withdraw, accountNo: e.target.value})}/>
        <input placeholder="Amount" onChange={e => setWithdraw({...withdraw, amount: e.target.value})}/>
        <button onClick={() => handle("withdraw", withdraw)}>Withdraw</button>
      </div>

      <div className="box">
        <h2>Transfer</h2>
        <input placeholder="Sender Account" onChange={e => setTransfer({...transfer, senderAccount: e.target.value})}/>
        <input placeholder="Receiver Account" onChange={e => setTransfer({...transfer, receiverAccount: e.target.value})}/>
        <input placeholder="Amount" onChange={e => setTransfer({...transfer, amount: e.target.value})}/>
        <button onClick={() => handle("transfer", transfer)}>Transfer</button>
      </div>

      <div className="box">
        <h2>Accounts List</h2>
        <table>
          <thead>
            <tr>
              <th>Account</th>
              <th>Name</th>
              <th>Balance</th>
              <th>KYC</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.accountNo}>
                <td>{a.accountNo}</td>
                <td>{a.holderName}</td>
                <td>{a.balance}</td>
                <td>{a.isKYCVerified ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="msg">{msg}</div>
    </div>
  );
}

export default App;
