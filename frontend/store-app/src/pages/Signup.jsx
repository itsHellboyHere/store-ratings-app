import React, { useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Navigate, useNavigate } from 'react-router-dom'
const Signup = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        address: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    }
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post('/sign-up', user);
            console.log(res.data)
            toast.success('Signed up successfully');
            navigate('/login');
        } catch (err) {
            console.log(err)
            setError(err?.response?.data?.error || 'Failed to signup')
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <main className='max-w-md  p-6 mx-auto'>
            <h2 className='text-2xl text-gray-600 font-bold mb-4'>SignUp</h2>
            {error && <p className='text-sm text-red-700'>{error}</p>}
            <form className='space-y-4 mt-4' onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={user.name}
                    onChange={handleChange}
                    placeholder="Enter your Name"
                    className="w-full p-2 border rounded"
                    required
                    name='name'
                />
                <input
                    name='email'
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Enter your Email"
                    className="w-full p-2 border rounded"
                    required
                />
                <div className="relative">
                    <input
                        name='password'
                        type={showPassword ? "text" : "password"}
                        value={user.password}
                        onChange={handleChange}
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
                <input
                    name='address'
                    type="text"
                    value={user.address}
                    onChange={handleChange}
                    placeholder="Enter your Address"
                    className="w-full p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Signup"}
                </button>

            </form>
        </main>
    )
}

export default Signup