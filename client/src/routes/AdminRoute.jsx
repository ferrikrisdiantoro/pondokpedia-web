import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Tampilkan spinner/loading jika data user masih dimuat
    if (loading) {
        return <div>Loading...</div>; // Bisa diganti dengan komponen spinner
    }

    // Periksa apakah user adalah admin
    if (!user || user.role !== 'admin') {
        alert('Access denied! Only admins can view this page.');
        return <Navigate to="/" replace />; // Redirect ke halaman utama
    }

    return children;
};

export default AdminRoute;
