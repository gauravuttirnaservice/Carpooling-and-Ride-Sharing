import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // Update to match your backend dev URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token safely to all outgoing requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor for handling missing token / token expiry uniformly
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If the server returns a 401 Unauthorized, we can optionally clear token or redirect
        if (error.response && error.response.status === 401) {
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
