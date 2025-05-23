import axios from '../api/axios';
import { useEffect, useState } from 'react'
import debounce from 'lodash.debounce';
import { Link } from 'react-router-dom';
const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        address: '',
        role: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/admin/users', { params: filters });
            setUsers(res.data)
        }
        catch (err) {
            console.log(err)

        } finally {
            setLoading(false)
        }
    };
    // debounce the call
    const debouncedFetch = debounce(fetchUsers, 500);

    useEffect(() => {
        debouncedFetch(filters);
        return () => {
            debouncedFetch.cancel(); // cleanup 
        };
    }, [filters]);

    const clearUpFilters = () => {
        setFilters({
            name: '',
            email: '',
            address: '',
            role: '',
        });
    };
    const roleBadges = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-700';
            case 'OWNER': return 'bg-yellow-600';
            case 'USER': return 'bg-green-600';
            default: return 'bg-gray-300';
        }
    };
    return (
        <main className='max-w-6xl p-6 mx-auto'>
            <h2 className='text-2xl text-slate-950 font-bold mb-4'>All Users</h2>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input className='p-2 border rounded' type='text' name='name' placeholder='Name' value={filters.name} onChange={handleChange} />
                <input className='p-2 border rounded' type='text' name='email' placeholder='Email' value={filters.email} onChange={handleChange} />
                <input className='p-2 border rounded' type='text' name='address' placeholder='Address' value={filters.address} onChange={handleChange} />
                <select name='role' value={filters.role} onChange={handleChange} className='border rounded p-2'>
                    <option value=""> All Roles</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="OWNER">OWNER</option>
                    <option value="USER">USER</option>
                </select>
            </div>
            {/* Clear the filters */}
            <div className="mb-5">
                <button
                    className=' bg-blue-600 text-sm text-white p-2 rounded hover:bg-blue-700'
                    onClick={clearUpFilters}
                >
                    Clear Filters
                </button>
            </div>
            {loading ? (
                <p className="text-gray-500">Loading users...</p>
            ) : (
                <div className="overflow-auto">
                    <table className='w-full table-auto border-collapse border'>
                        <thead>
                            <tr className='bg-gray-100'>
                                <th className='p-2 border text-left'>Name</th>
                                <th className='p-2 border text-left'>Email</th>
                                <th className="border p-2 text-left">Address</th>
                                <th className="border p-2 text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">No users found</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td className='p-2 border'>
                                            <Link to={`/admin/users/${user.id}`} className="text-blue-600 hover:underline">
                                                {user.name}
                                            </Link>
                                        </td>
                                        <td className='p-2 border'>{user.email}</td>
                                        <td className='p-2 border'>{user.address}</td>
                                        <td className='p-2 border'> <span className={`text-white text-xs px-2 py-1 rounded ${roleBadges(user.role)}`}>
                                            {user.role}
                                        </span></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    )
}

export default UserList