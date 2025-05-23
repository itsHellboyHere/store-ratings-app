import React, { useEffect, useState } from 'react'
import axios from '../api/axios'
import { Link } from 'react-router-dom';
const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // console.log(stores)
    const fetchStores = async () => {
        try {
            setLoading(true)
            const res = await axios.get("/admin/stores");
            // console.log(res.da)
            setStores(res.data);

        } catch (err) {
            console.log(err);
            setError(err.response?.data?.error || 'Failed to fetch stores')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStores();
    }, [])

    if (loading) {
        return (
            <main className="max-w-5xl mx-auto p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Stores</h2>
                <div className="space-y-4 animate-pulse ">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-6 w-full bg-gray-200 rounded"></div>
                    ))}
                </div>
            </main>
        );
    }
    if (error) {
        return <p className="text-red-600 p-4">{error}</p>;
    }


    return (
        <main className='max-w-5xl mx-auto p-6'>
            <h2 className='text-2xl font-bold text-gray-600 mb-4'>All Stores</h2>
            <div className="overflow-x-auto ">
                <table className='border w-full border-gray-400 rounded '>
                    <thead className='bg-gray-100 text-left'>
                        <tr>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Address</th>
                            <th className="p-2 border">Avg Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center p-4 text-gray-500">
                                    No stores found.
                                </td>
                            </tr>
                        ) : (
                            stores.map((store) => (
                                <tr key={store.id} className="hover:bg-gray-50">
                                    <td className="p-2 border">
                                        <Link to={`/stores/${store.id}`} className="text-blue-600 hover:underline">
                                            {store.name}
                                        </Link>
                                    </td>
                                    <td className="p-2 border">{store.email}</td>
                                    <td className="p-2 border">{store.address}</td>
                                    <td className="p-2 border text-yellow-600 font-semibold">{store.avgRating}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    )
}

export default StoreList