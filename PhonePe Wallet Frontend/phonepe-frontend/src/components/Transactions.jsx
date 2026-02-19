import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Transactions() {
    const navigate = useNavigate();
    const upiId = localStorage.getItem("upiId");

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
    if (!upiId) {
        navigate("/login");
        return;
    }

    const fetchTransactions = async () => {
        try {
            const res = await api.get(`/api/transaction/history/${upiId}`);
            setTransactions(res.data.data);
        } catch (err) {
            alert("Failed to load transactions");
        }
    };

    fetchTransactions();
}, [upiId, navigate]);

    return (
        <div className="dashboard">

            <div className="navbar">
                <div className="logo">MRU Pay</div>
                <button className="logout" onClick={() => navigate("/dashboard")}>
                    Back
                </button>
            </div>

            <div className="container">
                <div className="send-card">
                    <h3>Transaction History</h3>

                    {transactions.length === 0 ? (
                        <p>No transactions found</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, index) => (
                                    <tr key={index}>
                                        <td className={tx.senderUpi === upiId ? "debit" : "credit"}>
                                            {tx.senderUpi === upiId ? "Sent" : "Received"}
                                        </td>
                                        <td>{tx.senderUpi}</td>
                                        <td>{tx.receiverUpi}</td>
                                        <td className="amount">₹{tx.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Transactions;
