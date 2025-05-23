import React, { useEffect, useState } from 'react'
import axios from '../api/axios'
const AdminDashboard = () => {
    const [stats, setStats] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getDashBoardStats = async () => {
            try {
                setLoading(true)
                setError(null);
                const res = await axios.get('/admin/dashboard');
                setStats(res.data)
            }
            catch (err) {
                console.log(err)
                setError("Failed to load stats");

            } finally {
                setLoading(false);
            }
        };
        getDashBoardStats();
    }, [])
    if (loading) {
        return (
            <main className="max-w-4xl mx-auto p-8">
                <h2 className='text-2xl font-bold mb-6'>Admin Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-200 h-28 rounded-md text-center p-6">
                            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
                            <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto"></div>
                        </div>

                    ))}
                </div>
            </main>
        );
    }
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    return (
        <main className=' max-w-4xl mx-auto p-8'>
            <h2 className='text-2xl font-bold mb-6'>Admin Dashboard</h2>
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded shadow text-center">
                        <h4 className='text-lg font-semibold'>Total Users</h4>
                        <p className='text-2xl'>{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow text-center">
                        <h4 className='text-lg font-semibold'>Total Stores</h4>
                        <p className='text-2xl'>{stats.totalStores}</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow text-center">
                        <h4 className='text-lg font-semibold'>Total Ratings</h4>
                        <p className='text-2xl'>{stats.totalRatings}</p>
                    </div>
                </div>
            )
            }
        </main>
    )
}

export default AdminDashboard