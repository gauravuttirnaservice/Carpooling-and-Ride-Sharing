import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAdmin } from '../components/admindashboard/AdminContext';

export const useAdminData = () => {
    const { showToast } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const fetchStats = useCallback(async (page = 1, limit = 6) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append('page', page);
            if (limit) params.append('limit', limit);

            const res = await axiosInstance.get(`/admin/dashboard?${params.toString()}`);
            return res.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to fetch stats', 'error');
            return null;
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const fetchUsers = useCallback(async (page = 1, limit = 50, search = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append('page', page);
            if (limit) params.append('limit', limit);
            if (search) params.append('search', search);

            const res = await axiosInstance.get(`/admin/users?${params.toString()}`);
            return res.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to fetch users', 'error');
            return [];
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const fetchUser = useCallback(async (userId) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/admin/users/${userId}`);
            return res.data.data ? res.data.data : res.data; // Handle potential different response structures
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to fetch user', 'error');
            return null;
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const verifyAadhar = useCallback(async (userId) => {
        try {
            const res = await axiosInstance.put(`/admin/users/${userId}/verify-aadhar`);
            showToast(res.data.message || 'User verified successfully', 'success');
            return true;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to verify user', 'error');
            return false;
        }
    }, [showToast]);

    const fetchRides = useCallback(async (page = 1, limit = 50, status = 'all', search = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append('page', page);
            if (limit) params.append('limit', limit);
            if (status !== 'all') params.append('status', status);
            if (search) params.append('search', search);

            const res = await axiosInstance.get(`/admin/rides-with-driver?${params.toString()}`);
            return res.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to fetch rides', 'error');
            return [];
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const fetchRide = useCallback(async (rideId) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/admin/rides/${rideId}`);
            return res.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to fetch ride details', 'error');
            return null;
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const cancelRide = useCallback(async (rideId) => {
        try {
            const res = await axiosInstance.put(`/admin/rides/${rideId}/cancel`);
            showToast(res.data.message || 'Ride cancelled successfully', 'success');
            return true;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to cancel ride', 'error');
            return false;
        }
    }, [showToast]);

    const verifyDriver = useCallback(async (rideId) => {
        try {
            const res = await axiosInstance.put(`/admin/rides/${rideId}/verify-driver`);
            showToast(res.data.message || 'Driver verified successfully', 'success');
            return true;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to verify driver', 'error');
            return false;
        }
    }, [showToast]);

    const fetchBookings = useCallback(async (page = 1, limit = 50, status = 'all') => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append('page', page);
            if (limit) params.append('limit', limit);
            if (status !== 'all') params.append('status', status);

            const res = await axiosInstance.get(`/admin/bookings?${params.toString()}`);
            return res.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to fetch bookings', 'error');
            return [];
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const fetchReviews = useCallback(async (page = 1, limit = 50) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append('page', page);
            if (limit) params.append('limit', limit);

            const res = await axiosInstance.get(`/admin/reviews?${params.toString()}`);
            return res.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to fetch reviews', 'error');
            return [];
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const moderateReview = useCallback(async (reviewId) => {
        try {
            const res = await axiosInstance.put(`/admin/reviews/${reviewId}/moderate`);
            showToast(res.data.message || 'Review visibility toggled', 'success');
            return true;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to moderate review', 'error');
            return false;
        }
    }, [showToast]);

    const fetchCities = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/admin/cities');
            return res.data.data ? res.data.data : res.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to fetch cities', 'error');
            return [];
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const addCityWithPoints = useCallback(async (cityData) => {
        try {
            const res = await axiosInstance.post('/admin/cities-with-points', cityData);
            showToast('City and points added successfully', 'success');
            return res.data.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to add city with points', 'error');
            return null;
        }
    }, [showToast]);

    const addCity = useCallback(async (cityData) => {
        try {
            const res = await axiosInstance.post('/admin/cities', cityData);
            showToast('City added successfully', 'success');
            return res.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to add city', 'error');
            return null;
        }
    }, [showToast]);

    const deleteCity = useCallback(async (cityId) => {
        try {
            const res = await axiosInstance.delete(`/admin/cities/${cityId}`);
            showToast(res.data.message || 'City deleted successfully', 'success');
            return true;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to delete city', 'error');
            return false;
        }
    }, [showToast]);

    return {
        loading,
        fetchStats,
        fetchUsers,
        fetchUser,
        verifyAadhar,
        fetchRides,
        fetchRide,
        cancelRide,
        verifyDriver,
        fetchBookings,
        fetchReviews,
        moderateReview,
        fetchCities,
        addCity,
        addCityWithPoints,
        deleteCity
    };
};
