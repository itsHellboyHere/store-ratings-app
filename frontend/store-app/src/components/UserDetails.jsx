import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from '../api/axios';
const UserDetails = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');
    const { id } = useParams()
    console.log(id)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/admin/users/${id}`);
                setUser(res.data);
            }
            catch (err) {
                console.log(err)
                setError(err.response?.data?.error || "Failed to load user details")
            }
            finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [id])

    if (loading) return (
        <main className='max-w-3xl mx-auto p-8'>
            <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                <div className="bg-white p-6 shadow rounded space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                </div>
            </div>
        </main>

    )
    if (error) return <p className="p-7 text-red-700">{error}</p>;
    if (!user) return null;

    return (
        <main className='max-w-3xl mx-auto p-8'>
            <Link to='/admin/users' className='text-blue-600 hover:unerline mb-5 inline-block'>&larr; Back to Users</Link>
            <h2 className='text-2xl text-gray-600 font-bold mb-4'>User Details</h2>
            <div className="bg-white p-6 shadow rounded ">
                <p className='mb-2 font-mono'><strong>Name: </strong>{user.name}</p>
                <p className='mb-2 font-mono'><strong>Email: </strong>{user.email}</p>
                <p className='mb-2 font-mono'><strong>Address: </strong>{user.address}</p>
                <p className="mb-2 font-mono">
                    <strong>Role:</strong>{' '}
                    <span className={`text-white text-xs px-2 py-1 rounded ${user.role === 'ADMIN'
                        ? 'bg-red-600'
                        : user.role === 'OWNER'
                            ? 'bg-yellow-400'
                            : 'bg-green-500'}`}>
                        {user.role}
                    </span>
                </p>
                {user.role === 'OWNER' && (
                    <>
                        <p className='mt-4 font-semibold text-indigo-600'>
                            Average Store Ratings: {user.avgStoreRating ?? 'N/A'}
                        </p>
                        <p className='mt-2 font-semibold text-gray-800'>
                            Total Stores Owned: {user.totalStores}
                        </p>
                    </>
                )}
            </div>
        </main>
    )
}

export default UserDetails