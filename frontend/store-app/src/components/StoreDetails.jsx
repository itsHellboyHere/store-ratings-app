import axios from '../api/axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { renderStars } from "../utils/star"
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
const StoreDetails = () => {
    const [store, setStore] = useState(null)
    const [userRating, setUserRating] = useState('');
    const { id } = useParams();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const { authUser } = useAuthContext()
    const [submitting, setSubmitting] = useState(false);
    const fetchStoreDetails = async () => {
        try {
            setLoading(true)
            setError("");

            const res = await axios.get(`/stores/${id}`);
            setStore(res.data);
            setUserRating(res.data.userRating || '');
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.error)
        }
        finally {
            setLoading(false)
        }
    }
    const getRatingColor = (avg) => {
        if (avg >= 4.5) return 'text-green-600';
        if (avg >= 3) return 'text-yellow-500';
        return 'text-red-700';
    };
    useEffect(() => {
        fetchStoreDetails();
    }, [id]);

    const handleRatingSubmit = async () => {
        try {
            setSubmitting(true)
            setError("")
            const res = await axios.post(`/stores/${id}/rate`, { score: Number(userRating) });
            fetchStoreDetails();
            toast.success(res.data.message)
        } catch (err) {
            setError(err.response?.data?.error)
        } finally {
            setSubmitting(false)
        }
    }
    if (loading) return (
        <main className="max-w-2xl mx-auto p-6">
            <div className="space-y-4 ">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="mt-6 w-full h-10 bg-gray-200 rounded animate-pulse"
                    ></div>
                ))}
            </div>
        </main>)
    if (error) return <p className='text-red-600 text-sm '>{error}</p>
    if (!store) return <p>Store not found</p>;
    return (
        <main className="max-w-2xl mx-auto p-6">
            <Link to='/dashboard' className='text-blue-600 hover:unerline mb-5 inline-block'>&larr; Back to Dashboard</Link>
            <div className="bg-white rounded-2xl shadow-md p-6 border space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">{store.name}</h3>

                <p className="text-gray-700">
                    <span className="font-semibold">Address:</span> {store.address}
                </p>

                <p className="text-gray-700">
                    <span className="font-semibold">Average Rating:</span>{" "}
                    <span className={getRatingColor(Number(store.averageRating))}>
                        {store.averageRating}
                    </span>{" "}
                    {renderStars(Number(store.averageRating))}
                </p>
                {['OWNER', 'ADMIN'].includes(authUser?.role) && (
                    <p className="text-gray-700">
                        <span className="font-semibold">Owner Email:</span> {store.ownerEmail}
                    </p>
                )}
                {authUser?.role === "USER" && (
                    <p className="text-gray-700 mb-4">
                        <span className="font-semibold">Your Rating:</span>{" "}
                        <span className={`ml-1 font-semibold ${getRatingColor(Number(store.userRating))}`}>
                            {store.userRating}
                        </span>{" "}
                        {renderStars(Number(store.userRating))}
                    </p>)}
                {authUser?.role === "USER" && (<div className="mt-6">
                    <label htmlFor="rating" className="block font-medium">Rate (1-5):</label>
                    <input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={userRating}
                        onChange={(e) => setUserRating(e.target.value)}
                        className="border rounded px-2 py-1 w-24 mt-1"
                    />
                    <button
                        onClick={handleRatingSubmit}
                        className="ml-4 bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-60"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : (store.userRating ? 'Update Rating' : 'Submit Rating')}
                    </button>
                </div>)}
            </div>

        </main>


    )
}

export default StoreDetails