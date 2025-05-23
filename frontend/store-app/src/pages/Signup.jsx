import React, { useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'
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
    const handleChange = (e) => {
        const { name, value } = e.target;

        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    }
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
                <input
                    name='password'
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="Enter your Password"
                    className="w-full p-2 border rounded"
                    required
                />
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