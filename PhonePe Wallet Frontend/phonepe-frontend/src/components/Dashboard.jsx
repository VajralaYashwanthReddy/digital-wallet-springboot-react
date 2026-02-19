import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const upiId = localStorage.getItem("upiId");
    const name = localStorage.getItem("name");

    const [balance, setBalance] = useState(0);
    const [receiverUpi, setReceiverUpi] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [addAmount, setAddAmount] = useState("");

    useEffect(() => {
        if (!upiId) {
            navigate("/login");
            return;
        }

        const loadBalance = async () => {
            try {
                // const res = await api.get(`/wallet/${upiId}`);
                const res = await api.get(`/api/wallet/${upiId}`);
                setBalance(res.data.data.balance);
            } catch (err) {
                alert("Failed to load balance");
            } finally {
                setLoading(false);
            }
        };

        loadBalance();
    }, [upiId, navigate]);

    const confirmAddMoney = async () => {
        if (!addAmount || addAmount <= 0) {
            alert("Enter valid amount");
            return;
        }

        try {
            await api.post("/api/wallet/add", {
            // await api.post("/wallet/add", {
                upiId,
                amount: Number(addAmount),
            });

            alert("Money added successfully");
            setShowModal(false);
            setAddAmount("");
            window.location.reload();
        } catch {
            alert("Failed to add money");
        }
    };

    const sendMoney = async () => {
        if (!receiverUpi || !amount) {
            alert("Enter all details");
            return;
        }

        try {
            await api.post("/api/transaction/send", {
                senderUpi: upiId,
                receiverUpi,
                amount: Number(amount),
            });

            alert("Money sent successfully");
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || "Transaction failed");
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="dashboard">
            <div className="navbar">
                <div>
                    <div className="logo">MRU Pay</div>
                    <div className="subtitle">Malla Reddy University</div>
                </div>

                <div>
                    <span>Welcome, {name}</span>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>

            <div className="container">
                <div className="balance-card">
                    <h3>Wallet Balance</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div>₹{balance.toFixed(2)}</div>
                    )}
                    <button onClick={() => setShowModal(true)}>Add Money</button>
                </div>

                <div className="send-card">
                    <h3>Send Money</h3>

                    <input
                        placeholder="Recipient UPI ID"
                        value={receiverUpi}
                        onChange={(e) => setReceiverUpi(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <button onClick={sendMoney}>Send Money</button>

                    <button onClick={() => navigate("/transactions")}>
                        View Transactions
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <input
                        type="number"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                    />
                    <button onClick={confirmAddMoney}>OK</button>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
