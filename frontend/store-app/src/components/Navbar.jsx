import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import useLogout from '../hooks/useLogout';
import { Menu, X } from 'lucide-react'; // You can use Heroicons or Lucide

const Navbar = () => {
    const { loading, logout } = useLogout();
    const { authUser } = useAuthContext();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    return (
        <nav className="bg-emerald-100 text-slate-700 px-4 py-3 shadow-md">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                {/* Brand */}
                <Link to="/dashboard" className="font-bold text-xl text-emerald-800">
                    Store App
                </Link>

                {/* Mobile Toggle Button */}
                <button
                    className="md:hidden"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-6 items-center">
                    {authUser ? (
                        <>
                            <span className="capitalize text-sm bg-white px-2 py-1 rounded border">
                                Role: {authUser.role}
                            </span>
                            {authUser.role === 'ADMIN' && (
                                <>
                                    <Link to="/admin/users" className="hover:underline">Users</Link>
                                    <Link to="/admin/stores" className="hover:underline">Stores</Link>
                                    <Link to="/admin/create-user" className="hover:underline">Create User</Link>
                                    <Link to="/admin/create-store" className="hover:underline">Add Store</Link>
                                </>
                            )}
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/signup" className="hover:underline">Signup</Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col gap-4 mt-3 px-2">
                    {authUser ? (
                        <>
                            <span className="capitalize text-sm bg-white px-2 py-1 rounded border w-fit">
                                Role: {authUser.role}
                            </span>
                            {authUser.role === 'ADMIN' && (
                                <>
                                    <Link to="/admin/users" onClick={toggleMenu}>Users</Link>
                                    <Link to="/admin/stores" onClick={toggleMenu}>Stores</Link>
                                    <Link to="/admin/create-user" onClick={toggleMenu}>Create User</Link>
                                    <Link to="/admin/create-store" onClick={toggleMenu}>Add Store</Link>
                                </>
                            )}
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={toggleMenu}>Login</Link>
                            <Link to="/signup" onClick={toggleMenu}>Signup</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
