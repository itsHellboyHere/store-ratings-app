import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { setAuthUser } = useAuthContext();
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return;
        }
        try {
            setLoading(true);
            setError('');

            const res = await axios.put('/users/change-password', { newPassword })
            // get the updated user from server-side
            const updatedUser = res.data.user;

            // update the comtext and localStorage
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setAuthUser(updatedUser);
            toast.success(res.data.message);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update password");
        } finally {
            setLoading(false);
        }


    }

    return (
        <main className='max-w-md mx-auto p-10'>
            <h3 className='text-xl font-bold mb-4 text-gray-500'>Change Your Password</h3>
            {error && <p className="text-red-600">{error}</p>}
            <form className='space-y-4' onSubmit={handleSubmit}>

                <input
                    type="password"
                    placeholder="New Password"
                    className='w-full p-2 border rounded'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    className='w-full p-2 border rounded'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
                    disabled={loading || newPassword !== confirmPassword}

                >
                    {loading ? 'Changing...' : 'Change Password'}
                </button>
            </form>
            <p className='mt-4 text-sm text-gray-500'>
                Make sure to choose a strong password that you haven't used before.
            </p>

        </main>
    )
}

export default ChangePassword