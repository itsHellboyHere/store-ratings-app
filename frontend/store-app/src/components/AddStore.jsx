import { useState } from 'react'
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const AddStore = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);

    const [store, setStore] = useState({
        name: "",
        email: "",
        address: "",
        ownerEmail: ""
    })
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;

        setStore(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError();

            const res = await axios.post('/admin/create-store', store)
            console.log(res.data)
            toast.success(res.data.message)
            navigate('/dashboard');
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.error || 'Failed to create store')
        }

        finally {
            setLoading(false)
            setStore({
                name: "",
                email: "",
                address: "",
                ownerEmail: ""
            })
        }
    }
    return (
        <main className='max-w-md mx-auto p-10 '>
            <h3 className='text-xl font-bold mb-4 text-gray-600 '>Create Store</h3>
            {error && <p className="text-red-600">{error}</p>}
            <form className='space-y-4' onSubmit={handleSubmit}>
                <input
                    className='w-full rounded border p-2'
                    type='text'
                    name='name'
                    required
                    placeholder='Store Name'
                    value={store.name}
                    onChange={handleChange}
                />
                <input
                    className='w-full border rounded p-2'
                    type='email'
                    name='email'
                    required
                    placeholder='Store Email'
                    value={store.email}
                    onChange={handleChange}
                />
                <input
                    className='w-full rounded border p-2'
                    type='text'
                    name='address'
                    required
                    placeholder='Store Address'
                    value={store.address}
                    onChange={handleChange}
                />
                <input
                    className='w-full p-2 rounded border'
                    type='email'
                    name='ownerEmail'
                    required
                    placeholder='Owner Email'
                    value={store.ownerEmail}
                    onChange={handleChange}
                />
                <button
                    className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
                    type='submit'
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Store'}
                </button>
            </form>
        </main>
    )
}

export default AddStore