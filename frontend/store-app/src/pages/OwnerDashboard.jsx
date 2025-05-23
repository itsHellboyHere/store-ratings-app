import React, { useEffect, useState } from 'react'
import axios from '../api/axios';
const OwnerDashboard = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')
    const fectchStores = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/stores/owner/dashboard');
            setStores(res.data);

        } catch (err) {
            console.log(err.response?.data?.error)
            setError(err.response?.data?.error || "failed to fetch stores");
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fectchStores();
    }, [])

    if (loading) return <p className="p-8 text-gray-700">Loading dashboard...</p>;
    if (error) return <p className="p-8 text-red-700">{error}</p>;
    if (stores.length === 0) return <p className="p-8 text-gray-600">No store data found.</p>;
    return (
        <main className='max-w-6xl p-6 mx-auto'>
            <h3 className="text-2xl font-bold text-gray-600 mb-6">Owner Dashboard</h3>
            {
                stores.map((store) => (
                    <div className="mb-8 border rounded p-6 shadow-sm bg-white" key={store.id}>
                        <h4 className='text-xl text-indigo-800 mb-2 font-semibold'>{store.storeName}</h4>
                        <p className='mb-2 text-gray-800'><strong>Address: </strong>{store.address}</p>
                        <p className='text-gray-800 mb-4'><strong>Average Rating:</strong> ⭐ {store.averageRating}</p>
                        <h4 className="text-md font-semibold text-gray-800 mb-2">User Ratings:</h4>
                        {
                            store.ratings.length === 0 ? (
                                <p className='text-sm text-gray-600'>No ratings submitted yet.</p>
                            ) : (
                                <table className='table w-full border border-collapse mt-3'>
                                    <thead className='bg-gray-100'>
                                        <tr>
                                            <td className='p-2 border text-center '>User Name</td>
                                            <td className='p-2 border text-center '>User Email</td>
                                            <td className='p-2 border text-center '>Rating</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {store.ratings.map((rating) => (
                                            <tr key={rating.id}>
                                                <td className='p-2 border text-center'>{rating.userName}</td>
                                                <td className='p-2 border text-center'>{rating.userEmail}</td>
                                                <td className='p-2 border text-center'>⭐ {rating.score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        }
                    </div>
                ))
            }
        </main>
    )
}

export default OwnerDashboard