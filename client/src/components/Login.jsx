import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function LoginPage() {
    const [username, setUsername] = useState(""); // For login
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newUsername, setNewUsername] = useState(""); // For signup
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const [currentForm, setCurrentForm] = useState("login"); // State to manage the visible form
    const [error, setError] = useState(""); // State for error messages
    const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password

    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); 
        console.log(email)
        console.log(password)
        try {
            const response = await axios.post("http://localhost:8000/login", {
                userMailId: email,
                password: password,
            });
            console.log("Login Successful:", response.data);
            navigate("/location", { state: { userMailId: email } }); // Pass email instead of undefined variable
        } catch (error) {
            setError("Login Error: " + (error.response?.data?.detail || "Invalid credentials"));
            console.error("Login Error:", error);
        }
    };

    const handleGetStarted = async (e) => {
        e.preventDefault();
        setError(""); 
        console.log(newUsername);
        try {
            const response = await axios.post("http://localhost:8000/signup", {
                userMailId: newEmail, 
                userName: newUsername, 
                password: newPassword, // Use newPassword for signup
            });
            console.log("Account Created:", response.data);
            window.location.reload();
        } catch (error) {
            setError("Signup Error: " + (error.response?.data?.detail || "Failed to create account"));
            console.error("Signup Error:", error);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous errors
        try {
            const response = await axios.post("http://localhost:8000/forgot-password", {
                email: resetEmail,
            });
            console.log("Password Reset Email Sent:", response.data);
            window.location.reload();
        } catch (error) {
            setError("Password Reset Error: " + (error.response?.data?.detail || "Failed to send reset link"));
            console.error("Password Reset Error:", error);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Welcome</h2>

                {/* Links to toggle between forms */}
                <div className="flex justify-center space-x-4 mb-6 text-blue-500">
                    <button onClick={() => setCurrentForm("login")} className={`${currentForm === "login" ? "font-semibold" : ""}`}>
                        Login
                    </button>
                    <button onClick={() => setCurrentForm("signup")} className={`${currentForm === "signup" ? "font-semibold" : ""}`}>
                        Get Started
                    </button>
                    <button onClick={() => setCurrentForm("forgotPassword")} className={`${currentForm === "forgotPassword" ? "font-semibold" : ""}`}>
                        Forgot Password
                    </button>
                </div>

                {/* Conditional rendering for each form */}
                {currentForm === "login" && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2 top-2 text-blue-500"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                        >
                            Login
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Display error message */}
                    </form>
                )}

                {currentForm === "signup" && (
                    <form onSubmit={handleGetStarted} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            placeholder="New Email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2 top-2 text-blue-500"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300"
                        >
                            Get Started
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Display error message */}
                    </form>
                )}

                {currentForm === "forgotPassword" && (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Enter your email to reset password"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition-all duration-300"
                        >
                            Send Reset Link
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Display error message */}
                    </form>
                )}
            </div>
        </div>
    );
}

export default LoginPage;
