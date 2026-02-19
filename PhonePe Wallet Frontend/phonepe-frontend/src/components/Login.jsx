import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Login() {
    const [phone, setPhone] = useState("");
    const [pin, setPin] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post("/api/users/login", {
                phoneNumber: phone.trim(),
                pin: pin.trim(),
            });

            console.log("Login response:", response.data);

            if (response.data.success) {
                const user = response.data.data;

                localStorage.setItem("upiId", user.upiId);
                localStorage.setItem("name", user.name);

                // 🔥 FORCE NAVIGATION
                navigate("/dashboard", { replace: true });
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Login error:", error.response?.data);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="card">
            <h2 style={{ color: "orange" }}>MRU Pay</h2>
            <h2>Login</h2>

            <input
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <input
                type="password"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>

            <p onClick={() => navigate("/register")}>Register</p>
        </div>
    );
}

export default Login;
