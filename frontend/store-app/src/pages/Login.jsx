import React, { useState } from "react";
import useLogin from "../hooks/useLogin";
import { useAuthContext } from "../context/AuthContext";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
const Login = () => {
    const { login, loading } = useLogin();
    const { authUser } = useAuthContext()
    console.log(authUser)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    return (
        <main className="max-w-2xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    required
                />
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-2 border rounded pr-10"
                        required
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-3 text-gray-600"
                        tabIndex={-1}
                    >
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </main>
    );
};

export default Login;
