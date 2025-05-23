import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async (email, password) => {
        if (!email || !password) {
            toast.error('Please provide email and password.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post("/sign-in", { email, password });


            const flatUser = { ...data.user, token: data.token };

            localStorage.setItem("user", JSON.stringify(flatUser));
            setAuthUser(flatUser);
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return { login, loading };
};

export default useLogin;
