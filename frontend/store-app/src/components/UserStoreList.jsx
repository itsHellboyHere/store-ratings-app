import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import debounce from 'lodash.debounce';

const UserStoreList = () => {
    const [search, setSearch] = useState('');
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchStores = async (query = '', page = 1) => {
        try {
            setLoading(true)
            setError("")
            const res = await axios.get('/stores', { params: { search: query, page, limit: 5 } });
            setStores(res.data.stores);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (err) {
            // console.log(err)
            setError(err.response?.data.error || "failed to fetch stores")
        } finally {
            setLoading(false);
        }
    }
    const getRatingColor = (avg) => {
        if (avg >= 4.5) return 'text-green-600';
        if (avg >= 3) return 'text-yellow-500';
        return 'text-red-700';
    };

    const handleSearch = debounce((value) => {
        setCurrentPage(1);
        fetchStores(value, 1);
    }, 500)

    // debounce after key store stop and waits for 500 ms
    useEffect(() => {
        handleSearch(search);
        // clear on unmount
        return handleSearch.cancel;
    }, [search]);
    return (
        <main className='max-w-4xl mx-auto p-4'>
            <h2 className="text-xl font-bold mb-4">All Stores</h2>
            {/* search */}
            {error && <p className='text-sm text-red-600 mb-6'>{error}</p>}
            <input
                type='text'
                className='w-full rounded border mb-6 p-2'
                placeholder='search by name or address'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {/* Clear the search*/}
            <div className="mb-5">
                <button
                    className=' bg-blue-600 text-sm text-white p-2 rounded hover:bg-blue-700'
                    onClick={() => {
                        setSearch("");
                        fetchStores("", 1);
                    }}
                >
                    Clear Search
                </button>
            </div>
            {
                loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <ul className='space-y-4'>
                            {stores.map((store) => (
                                <li className='p-5 border roudned shadow' key={store.id}>
                                    <h3 className='text-lg font-semibold'>{store.name}</h3>
                                    <p className="text-sm text-gray-700">{store.address}</p>
                                    <p className="mt-1 font-semibold mb-2">
                                        Average Rating:
                                        <span className={getRatingColor(store.averageRating)}> {store.averageRating}</span>
                                    </p>
                                    <Link to={`/stores/${store.id}`} className="text-blue-600 underline font-medium">
                                        View Details & Rate
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {stores.length > 0 && (
                            <div className="flex items-center justify-between mt-6">
                                <button
                                    onClick={() => {
                                        if (currentPage > 1) {
                                            fetchStores(search, currentPage - 1);
                                        }
                                    }}
                                    disabled={currentPage === 1}
                                    className='bg-gray-200 border rounded py-2 px-2 disabled:opacity-45 '
                                >
                                    Prev
                                </button>
                                <span className="text-sm font-medium text-gray-500">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => {
                                        if (currentPage < totalPages) {
                                            fetchStores(search, currentPage + 1);
                                        }
                                    }}
                                    disabled={currentPage === totalPages}
                                    className='py-2 px-2 rounded border bg-gray-200 disabled:opacity-45'
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )
            }
        </main>
    )
}

export default UserStoreList