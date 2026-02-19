import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Register() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [upiId, setUpiId] = useState("");
    const [pin, setPin] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await api.post("/api/users/register", {
                name,
                phoneNumber: phone,
                upiId,
                pin,
            });

            if (response.data.success) {
                alert("Registration successful");
                navigate("/login");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="card">
            <h2>Register</h2>

            <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <input
                placeholder="UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
            />

            <input
                type="password"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
            />

            <button onClick={handleRegister}>Register</button>

            <p onClick={() => navigate("/login")}>
                Already have an account? Login
            </p>
        </div>
    );
}

export default Register;
