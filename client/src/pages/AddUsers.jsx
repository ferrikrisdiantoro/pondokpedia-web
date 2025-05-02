import React, { useState } from 'react';
import axios from 'axios';

const AddUsers = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // Default role
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.password.length < 8) {
            alert('Password harus minimal 8 karakter');
            return;
        }
    
        try {
            await axios.post('http://localhost:5000/api/user', formData);
            alert('User added successfully!');
            setFormData({ name: '', email: '', password: '', role: 'user' });
        } catch (error) {
            console.error("Error adding user:", error);
            alert('Failed to add user.');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Tambah Pengguna</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukan Nama"
                    className="border p-2 w-full"
                    required
                />
                <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukan Email"
                    type="email"
                    className="border p-2 w-full"
                    required
                />
                <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukan Password"
                    type="password"
                    className="border p-2 w-full"
                    required
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="border p-2 w-full"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button
                    type="submit"
                    className="bg-emerald-600 text-white px-4 py-2 rounded"
                >
                    Tambah Pengguna
                </button>
            </form>
        </div>
        </div>
        
    );
};

export default AddUsers;
