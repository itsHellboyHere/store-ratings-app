import { useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
const AddUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "",
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
        e.preventDefault();
        try {
            setError('');
            setLoading(true);

            const res = await axios.post('/admin/create-user', user)
            console.log(res.data)
            toast.success(res.data.message)
            // await new Promise(res => setTimeout(res, 2000))
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create user');
            console.log(err)
        } finally {
            setLoading(false)
            setUser({ name: '', email: '', password: '', address: '', role: '' })

        }
    }
    return (
        <main className='max-w-md mx-auto p-10'>
            <h3 className='text-xl font-bold mb-4 text-gray-500'>Create User</h3>
            {error && <p className="text-red-600">{error}</p>}
            <form className='space-y-4' onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    className='w-full p-2 border rounded'
                    value={user.name}
                    name='name'
                    onChange={handleChange}
                    required
                />
                <input
                    type='email'
                    placeholder='Email'
                    className='w-full p-2 border rounded'
                    value={user.email}
                    name='email'
                    onChange={handleChange}
                    required
                />
                <input
                    required
                    type='password'
                    placeholder='Enter the Password'
                    className='w-full p-2 border rounded'
                    value={user.password}
                    name='password'
                    onChange={handleChange}
                />
                <input
                    required
                    type='text'
                    placeholder='Enter the address'
                    className='w-full p-2 border rounded'
                    value={user.address}
                    name='address'
                    onChange={handleChange}
                />
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-600">Select Role:</label>
                    <div className="flex gap-4">
                        {["USER", "OWNER", "ADMIN"].map((roleOption) => (
                            <label key={roleOption} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="role"
                                    value={roleOption}
                                    checked={user.role === roleOption}
                                    onChange={handleChange}
                                    className="accent-emerald-500"
                                    required
                                />
                                {roleOption}
                            </label>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </form>
            <p className='mt-4 text-sm text-gray-500'>
                After a new user is created a mail will be sent to
                the respective user.
            </p>

        </main>
    )
}

export default AddUser