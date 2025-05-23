import axios from "axios";

const isProduction = window.location.hostname !== 'localhost';

const BASE_URL = isProduction
    ? 'https://store-ratings-app.onrender.com/api'
    : 'http://localhost:5000/api';
const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token from localStorage automatically
instance.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default instance;
