import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const logout = async () => {
        setLoading(true);
        try {
            await axios.post('/logout');
            localStorage.removeItem('user');
            setAuthUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Logout failed');
        } finally {
            setLoading(false);
        }
    };

    return { loading, logout };
};

export default useLogout;
